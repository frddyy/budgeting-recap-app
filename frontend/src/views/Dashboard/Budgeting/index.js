// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import Categories from "./components/Categories";
import Budgets from "./Budgets/components/Budgets";

function Tables() {
  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
      {/* <Budgets title={"Budget"}/> */}
      <Categories title={"Budget's Categories"}/>
    </Flex>
  );
}

export default Tables;
