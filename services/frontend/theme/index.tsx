import { extendTheme } from "@chakra-ui/react";
import { modalTheme } from "./modal";

export const customTheme = extendTheme({
  colors: {
    customPurple: {
      900: "#700097",
      800: "#8d0cba",
      700: "#a71ad8",
      600: "#b429e4",
      500: "#bf3aed",
      400: "#cb52f4",
      300: "#d871fc",
      200: "#e088ff",
      100: "#eaadff",
    },
    customPink: {
      900: "#a0007d",
      800: "#b80891",
      700: "#d210a8",
      600: "#e31db8",
      500: "#f42ec9",
      400: "#ff4ad7",
      300: "#ff73e0",
      200: "#ff94e7",
      100: "#ffb9f0",
    },
    customTeal: {
      900: "#086976",
      800: "#0e7b8a",
      700: "#1590a0",
      600: "#1b9eaf",
      500: "#28adbe",
      400: "#2cc1d4",
      300: "#3ad4e8",
      200: "#61e9fb",
      100: "#92f3ff",
    },
    customWhite: {
      900: "#ffffff",
    },
    customBlack: {
      900: "#000000",
    },
    customGray: {
      900: "#878787",
    },
  },
  components: {
    Modal: modalTheme,
  },
});
