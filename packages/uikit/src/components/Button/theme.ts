import { scales, variants } from "./types";

export const scaleVariants = {
  [scales.MD]: {
    height: "48px",
    padding: "0 24px",
  },
  [scales.SM]: {
    height: "32px",
    padding: "0 16px",
  },
  [scales.XS]: {
    height: "20px",
    fontSize: "12px",
    padding: "0 8px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "primary",
    color: "white",
  },
  [variants.SECONDARY]: {
    backgroundColor: "transparent",
    border: "2px solid",
    borderColor: "primary",
    boxShadow: "none",
    color: "primary",
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: "tertiary",
    boxShadow: "none",
    color: "primary",
  },
  [variants.SUBTLE]: {
    backgroundColor: "textSubtle",
    color: "backgroundAlt",
  },
  [variants.DANGER]: {
    backgroundColor: "failure",
    color: "white",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
    color: "white",
  },
  [variants.TEXT]: {
    backgroundColor: "transparent",
    color: "primary",
    boxShadow: "none",
  },
  [variants.LIGHT]: {
    backgroundColor: "input",
    color: "textSubtle",
    boxShadow: "none",
  },
  [variants.CUSTOM_PRIMARY]: {
    color: "white", fill: "white",
    backgroundColor: 'itemPrimary',
    borderRadius: '10px',
  },
  [variants.CUSTOM_SECONDARY_STRONGER]: {
    color: "itemPrimary", fill: "itemPrimary",
    backgroundColor: 'rgba(96, 197, 186, 0.5)',
    borderRadius: '10px',
    border: "1px solid",
    borderColor: "itemPrimary",
  },
  [variants.CUSTOM_SECONDARY]: {
    color: "itemPrimary", fill: "itemPrimary",
    backgroundColor: "transparent",
    borderRadius: '10px',
    border: "1px solid",
    borderColor: "itemPrimary",
    boxShadow: "none",
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.CUSTOM_COLOR_FIND]: {
    border: '2px solid #60C5BA',
    backgroundColor: 'transparent',
    color: '#60C5BA',
    fill: "#fff",
  },
};
