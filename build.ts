import * as esbuild from "https://deno.land/x/esbuild@v0.15.14/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";
import { fromFileUrl } from "https://deno.land/std@0.170.0/path/posix.ts";
import { encode } from "https://deno.land/std@0.170.0/encoding/base64.ts";

type BuildClientResult = {
  readonly scriptHash: Hash;
  readonly scriptContent: string;
};

const outputFilesToScriptFile = async (
  outputFiles: ReadonlyArray<esbuild.OutputFile>,
): Promise<{ readonly hash: Hash; readonly scriptContent: string }> => {
  for (const esbuildResultFile of outputFiles) {
    if (esbuildResultFile.path === "<stdout>") {
      const hash = await hashBinary(esbuildResultFile.contents);
      console.log("js 発見");
      const scriptContent = new TextDecoder().decode(
        esbuildResultFile.contents,
      );
      return {
        hash,
        scriptContent,
      };
    }
  }
  throw new Error("esbuild で <stdout> の出力を取得できなかった...");
};

const watchAndBuild = async (
  onBuild: (result: BuildClientResult) => void,
): Promise<void> => {
  const scriptHashAndContent = await outputFilesToScriptFile(
    (await esbuild.build({
      entryPoints: [
        fromFileUrl(
          import.meta.resolve("./startInBrowser.ts"),
        ),
      ],
      plugins: [denoPlugin()],
      write: false,
      bundle: true,
      minify: true,
      format: "iife",
      target: ["chrome108"],
      watch: {
        onRebuild: (error, result) => {
          if (error) {
            console.error(error);
          }
          if (result !== null) {
            outputFilesToScriptFile(
              result.outputFiles ?? [],
            ).then((hashAndContent) => {
              onBuild({
                scriptHash: hashAndContent.hash,
                scriptContent: hashAndContent.scriptContent,
              });
            });
          }
        },
      },
    })).outputFiles,
  );
  onBuild({
    scriptHash: scriptHashAndContent.hash,
    scriptContent: scriptHashAndContent.scriptContent,
  });
};

const editorWatchBuild = async (): Promise<void> => {
  await watchAndBuild((clientBuildResult) => {
    Deno.writeTextFile(
      new URL(import.meta.resolve("./dist.json")),
      JSON.stringify(clientBuildResult, undefined, 2),
    );
  });
};

editorWatchBuild();

export type Hash = string & { _hashString: never };

/**
 * バイナリのハッシュ値を生成する
 */
export const hashBinary = async (binary: BufferSource): Promise<Hash> => {
  return [...new Uint8Array(await crypto.subtle.digest("sha-256", binary))]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("") as Hash;
};

export const hashFromString = (value: string): Hash | undefined => {
  if (value.match(/^[0-9a-f]{64}$/gu) === null) {
    return undefined;
  }
  return value as Hash;
};
