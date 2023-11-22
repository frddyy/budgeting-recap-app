// Chakra imports
import { Flex, Grid, Icon, Box, useMediaQuery } from "@chakra-ui/react";
import React, { useState } from "react";
import Wallets from "./components/Wallets";
import CreditCard from "./components/CreditCard";
import BackgroundCard1 from "assets/img/BackgroundCard1.png";
import { RiMastercardFill } from "react-icons/ri";

// Helper function to format balance
const formatBalanceToRp = (balance) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(balance);
};

// Main component
function Tables() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLargerThanLG] = useMediaQuery("(min-width: 62em)");

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Grid templateColumns={{ sm: "1fr", lg: "1fr" }} gap="26px">
        <Box>
          <Grid
            templateColumns={{ sm: "1fr", lg: "1fr", xl: "repeat(4, 1fr)" }}
            gap="26px"
          >
            <CreditCard
              backgroundImage={BackgroundCard1}
              title="Total Balance"
              number={formatBalanceToRp(totalBalance)}
              icon={
                <Icon
                  as={RiMastercardFill}
                  w="48px"
                  h="auto"
                  color="gray.400"
                />
              }
            />
          </Grid>
          {isLargerThanLG && (
            <Grid templateColumns="1fr" gap="26px">
              <Wallets
                title="Wallets Table"
                onTotalBalanceChange={setTotalBalance}
              />
            </Grid>
          )}
        </Box>
      </Grid>
    </Flex>
  );
}

export default Tables;
