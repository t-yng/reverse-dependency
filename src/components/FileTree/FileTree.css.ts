import { style, globalStyle } from "@vanilla-extract/css";

export const root = style({
  padding: "0.8rem",
});

export const directoryContent = style({
  paddingLeft: "0.8rem",
  selectors: {
    "&:first-child": {
      paddingLeft: 0,
    },
  },
});

export const directorySummary = style({
  listStyle: "none",
  selectors: {
    "&:before": {
      content: ">",
      marginRight: "0.8rem",
    },
  },
});

globalStyle(`${root} li,summary`, {
  cursor: "pointer",
});

globalStyle(`${root} details[open] > summary:before`, {
  content: "v",
});
