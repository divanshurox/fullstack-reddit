import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  variant?: "small" | "regular";
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      maxW={variant === "regular" ? "700px" : "400px"}
      mt={8}
      mx="auto"
      w="100%"
    >
      {children}
    </Box>
  );
};
