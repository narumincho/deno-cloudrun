/** @jsx h */
import { h } from "npm:preact@10.11.3";
import { renderToString } from "npm:preact-render-to-string@5.2.6";
import { css } from "npm:@emotion/css@11.10.5";
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

export const main = (parameter: { readonly portNumber: number }) => {
  serve((_req: Request): Response => {
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
            <div>それな..?</div>
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
  }, {
    port: parameter.portNumber,
  });
};
