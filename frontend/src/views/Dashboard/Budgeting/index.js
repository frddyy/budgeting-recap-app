// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import Budgeting from "./components/Budgeting";

function Tables() {
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Budgeting title={"Budgeting Table"} />
    </Flex>
  );
}

export default Tables;
