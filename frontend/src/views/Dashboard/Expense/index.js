// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import Expense from "./components/Expense";

function Tables() {
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Expense title={"Expense Table"} />
    </Flex>
  );
}

export default Tables;
