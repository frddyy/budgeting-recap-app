// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import Income from "./components/Income";

function Tables() {
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Income title={"Income Table"} />
    </Flex>
  );
}

export default Tables;
