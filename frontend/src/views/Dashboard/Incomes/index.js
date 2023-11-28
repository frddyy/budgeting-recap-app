// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import Incomes from "./components/Incomes";

function Tables() {
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Incomes title={"Income Table"} />
    </Flex>
  );
}

export default Tables;
