// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import Wallets from "./components/Wallets";

function Tables() {
  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Wallets title={"Wallets Table"} />
    </Flex>
  );
}

export default Tables;
