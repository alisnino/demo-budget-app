import { Button } from "@chakra-ui/react";

export type ButtonVariants = "default" | "negative";

export type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: ButtonVariants;
  isSubmitButton?: boolean;
};

export const DefaultButton: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant,
  isSubmitButton,
}) => {
  const DefaultButtonStyles = {
    backgroundColor: variant === "negative" ? "white" : "customTeal.900",
    color: variant === "negative" ? "customTeal.900" : "white",
    _hover: {
      backgroundColor: "customTeal.800",
      color: "white",
    },
    _active: {
      borderColor: "customTeal.800",
      backgroundColor: "customTeal.700",
      color: "white",
    },
    border: "1px solid",
    borderColor: "customTeal.900",
    borderRadius: "8px",
    minWidth: "128px",
    maxWidth: "100%",
    width: "fit-content",
    height: "32px",
    lineHeight: "32px",
  };

  return (
    <Button
      onClick={isSubmitButton === true ? undefined : onClick}
      sx={DefaultButtonStyles}
      type={isSubmitButton === true ? "submit" : "button"}
    >
      {text}
    </Button>
  );
};
