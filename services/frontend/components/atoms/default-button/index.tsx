import { Button } from "@chakra-ui/react";

export type ButtonProps = {
  text: string;
  onClick: () => void;
};

export const DefaultButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  const DefaultButtonStyles = {
    backgroundColor: "customTeal.900",
    color: "white",
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
    <Button onClick={onClick} sx={DefaultButtonStyles}>
      {text}
    </Button>
  );
};
