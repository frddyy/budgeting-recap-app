// Chakra imports
import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import Incomes from "./components/Incomes";

function Tables() {
  const [totalAmount, setTotalAmount] = useState(0);
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Incomes title="Income Table" onTotalAmountChange={setTotalAmount} />
    </Flex>
  );
}

export default Tables;
