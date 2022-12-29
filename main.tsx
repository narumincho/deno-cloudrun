/** @jsx h */
import { h } from "npm:preact@10.11.3";
import { renderToString } from "npm:preact-render-to-string@5.2.6";
import { css } from "npm:@emotion/css@11.10.5";
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

export const main = (parameter: { readonly portNumber: number }) => {
  serve((_req: Request): Response => {
    const page: h.JSX.Element = (
      <div>
        <h1>Current time</h1>
        <p className={css({ background: "red" })}>
          {new Date().toISOString()}
        </p>
      </div>
    );
    const html = renderToString(page);
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }, {
    port: parameter.portNumber,
  });
};
