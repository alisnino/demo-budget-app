import { defineStyle, defineStyleConfig } from "@chakra-ui/react"

const baseStyle = defineStyle({
  borderRadius: "12px",
})

const primary = defineStyle({
  backgroundColor: "primary.500",
  color: "white",
  _hover: {
    backgroundColor: "primary.400",
  },
})

const secondary = defineStyle({
  backgroundColor: "secondary.500",
  color: "white",
})

const white = defineStyle({
  backgroundColor: "white",
  color: "black",
  border: "1px solid black",
  borderColor: "primary.500",
})

const sizes = {
  md: defineStyle({
    fontSize: "md",
    height: "40px",
    minWidth: "120px",
  }),
}

export const buttonTheme = defineStyleConfig({
  baseStyle,
  sizes,
  variants: { primary, secondary, white },
  defaultProps: {
    variant: "primary",
    size: "md",
  },
})
