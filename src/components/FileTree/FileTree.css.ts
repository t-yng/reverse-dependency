import { style, globalStyle } from "@vanilla-extract/css";

export const root = style({
  padding: "0.8rem",
  borderRight: "1px solid #D1D7DD",
  height: "100vh",
  width: "200px",
  fontSize: "1.4rem",
  overflowX: "scroll",
  overflowWrap: "normal",
  backgroundColor: "#F6F8FA",
});

globalStyle(`${root} li,summary`, {
  cursor: "pointer",
});

globalStyle(`${root} details[open] > summary:before`, {
  content: "v",
});
