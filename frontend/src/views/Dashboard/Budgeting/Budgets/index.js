// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import Budgets from "./components/Budgets";

function Tables() {
  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
      <Budgets title={"Budgets"}/>
    </Flex>
  );
}

export default Tables;
