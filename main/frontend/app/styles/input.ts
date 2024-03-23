import { inputAnatomy } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/react"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const primary = definePartsStyle({
  field: {
    height: "36px",
    backgroundColor: "white",
    _focus: {
      boxShadow: "none",
      border: "none",
    },
    _focusVisible: {
      boxShadow: "none",
      border: "none",
    },
  },
})

export const inputTheme = defineMultiStyleConfig({
  variants: { primary },
  defaultProps: {
    variant: "primary",
  },
})
