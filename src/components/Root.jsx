import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box, useMediaQuery } from "@chakra-ui/react";

export const Root = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <Box display={isLargerThan768 ? "flex" : "block"} bg="blue.100">
      <Navigation />
      <Box flex="1" p={4} bg="purple.200">
        <Outlet />
      </Box>
    </Box>
  );
};
