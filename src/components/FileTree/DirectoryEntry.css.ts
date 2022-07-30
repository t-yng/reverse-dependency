import { style } from "@vanilla-extract/css";

export const entry = style({
  selectors: {
    "&:hover": {
      backgroundColor: "#F1F3F6",
    },
  },
});

export const selected = style({
  backgroundColor: "#E8EBEE !important",
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
