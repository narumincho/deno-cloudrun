/** @jsx h */
import { h } from "npm:preact@10.11.3";
import { renderToString } from "npm:preact-render-to-string@5.2.6";
import { css } from "npm:@emotion/css@11.10.5";

export const main = (parameter: { readonly portNumber: number }) => {
  Deno.serve(
    { port: parameter.portNumber },
    async (request: Request): Promise<Response> => {
      const path = new URL(request.url).pathname.slice(1);
      console.log(path);
      if (path !== "") {
        const r2Response = await fetch(
          "https://pub-5887a2dc47a745a49c111fa8f58b8d75.r2.dev/" + path,
        );
        if (r2Response.ok) {
          return new Response(await r2Response.arrayBuffer());
        }
        return new Response("error", { status: 400 });
      }

      const page: h.JSX.Element = (
        <html lang="ja">
          <head>
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1.0"
            />
            <title>deno on Cloud Run</title>
            <style>
              {`* {
              background: black;
              color: white;
            }`}
            </style>
          </head>
          <body>
            <div>
              <h1>deno on Cloud Run</h1>
              <div>
                Deno Deploy の方がデプロイが速いけど,
                ffmpegとかの外部ライブラリを使いたいときは,
                DockerfileでインストールができるCloud Runの方が良い
              </div>
              <div className={css({ background: "red" })}>
                {new Date().toISOString()}
              </div>
            </div>
          </body>
        </html>
      );
      const html = "<!doctype html>" + renderToString(page);
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    },
  );
};
