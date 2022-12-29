/** @jsx h */
import { h } from "npm:preact@10.11.3";
import { css } from "npm:@emotion/css@11.10.5";
import { useState } from "npm:preact@10.11.3/hooks";

export const App = (): h.JSX.Element => {
  const [count, setCount] = useState<number>(0);
  return h(
    "div",
    { class: "box" },
    h("h1", {
      class: css({
        background: "red",
      }),
    }, "Deno in Cloud Run"),
    h("button", {
      onClick: () => {
        setCount((prev) => prev + 1);
      },
    }, "+"),
    h("div", {
      class: css({
        padding: count,
      }),
    }, "count=" + count),
  );
};
