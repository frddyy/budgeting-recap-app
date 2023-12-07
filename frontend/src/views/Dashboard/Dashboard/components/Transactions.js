// Chakra imports
import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TransactionRow from "components/Tables/TransactionRow";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

const Transactions = ({ transactions }) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  console.log(transactions);

  return (
    <Card my="24px">
      <CardHeader mb="12px">
        <Flex direction="column" w="100%">
          <Flex
            direction={{ sm: "column", lg: "row" }}
            justify={{ sm: "center", lg: "space-between" }}
            align={{ sm: "center" }}
            w="100%"
            my={{ md: "12px" }}
          >
            <Text
              color={textColor}
              fontSize={{ sm: "lg", md: "xl", lg: "lg" }}
              fontWeight="bold"
            >
              Your Transactions
            </Text>
            <Flex align="center">
              {/* <Icon
                as={FaRegCalendarAlt}
                color="gray.400"
                fontSize="md"
                me="6px"
              ></Icon> */}
              <Text color="gray.400" fontSize="sm" fontWeight="semibold">
                Recent Transactions
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" w="100%">
          {Object.entries(transactions).map(
            ([date, transactionsForDate], index) => (
              <React.Fragment key={index}>
                <Text
                  color="gray.400"
                  fontSize={{ sm: "sm", md: "md" }}
                  fontWeight="semibold"
                  my="12px"
                >
                  {date}
                </Text>
                {transactionsForDate.map((transaction, transIndex) => (
                  <TransactionRow
                    key={transIndex}
                    title={transaction.title}
                    type={transaction.type}
                    date={transaction.date}
                    amount={transaction.amount}
                  />
                ))}
              </React.Fragment>
            )
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Transactions;
