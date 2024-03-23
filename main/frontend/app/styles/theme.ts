import { extendTheme } from "@chakra-ui/react"
import { inputTheme } from "./input"
import { buttonTheme } from "./button"

export const theme = extendTheme({
  fonts: {
    body: `"Nunito", sans-serif`,
  },
  colors: {
    primary: {
      100: "#FFCAB4",
      200: "#FFB798",
      300: "#FFA782",
      400: "#FF986C",
      500: "#FF844F",
      600: "#FD6E30",
      700: "#F25E1E",
      800: "#E05215",
      900: "#D44102",
    },
    secondary: {
      100: "#FFE7B8",
      200: "#FFDA92",
      300: "#FFCF72",
      400: "#FFC658",
      500: "#FFBD3C",
      600: "#FFB320",
      700: "#F6A70D",
      800: "#E99C07",
      900: "#D48D02",
    },
    accent: {
      100: "#CFFFB1",
      200: "#BAFF90",
      300: "#A1FA6A",
      400: "#90EC58",
      500: "#81DE47",
      600: "#6BD32A",
      700: "#50CF02",
      800: "#48BD01",
      900: "#3C9E00",
    },
  },
  components: {
    Input: inputTheme,
    Button: buttonTheme,
  },
})
