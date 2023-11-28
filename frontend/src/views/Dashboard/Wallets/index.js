// Chakra imports
import { Flex, Grid, Icon, Box} from "@chakra-ui/react";
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
  
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Grid templateColumns={{ sm: "1fr", lg: "1fr 0.2fr" }} templateRows="1fr">
        <Box>
          <Grid
            templateColumns={{
              sm: "1fr",
              md: "1fr 1fr",
              xl: "1fr 1fr 1fr 1fr",
            }}
            templateRows={{ sm: "auto", md: "auto", xl: "auto" }}
            gap="26px"
          >
            <CreditCard
              backgroundImage={BackgroundCard1}
              title={"Total Balance"}
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
          <Grid templateColumns={{ sm: "1fr", lg: "1fr" }} templateRows="1fr">
            <Wallets
              title={"Wallets Table"}
              onTotalBalanceChange={setTotalBalance}
            />
          </Grid>
        </Box>
      </Grid>
    </Flex>
  );
}

export default Tables;
