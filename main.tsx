/** @jsx h */
import { h } from "npm:preact@10.11.3";
import { renderToString } from "npm:preact-render-to-string@5.2.6";
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { App } from "./App.ts";

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
            }

            .box {
              padding: 32px;
            }
            `}
          </style>
        </head>
        <body>
          <App />
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
