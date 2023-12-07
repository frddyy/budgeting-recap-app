import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

function TransactionRow(props) {
  const textColor = useColorModeValue("gray.700", "white");
  const { title, date, amount, type } = props; // Updated props

  // Helper function to format balance
  const formatBalanceToRp = (balance) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(balance);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formattedDate = formatDate(date);

  // Format the amount as currency
  const formattedCurrencyAmount = formatBalanceToRp(amount);

  // Prepend the + or - sign based on the transaction type
  const formattedAmount =
    type === "income"
      ? `+ ${formattedCurrencyAmount}`
      : `- ${formattedCurrencyAmount}`;

  console.log(type);
  // Determine the icon based on the transaction type
  const icon = type === "income" ? FaArrowUp : FaArrowDown;

  // Determine color based on the transaction type
  const amountColor = type === "income" ? "green.400" : "red.400";

  return (
    <Flex my="1rem" justifyContent="space-between">
      <Flex alignItems="center">
        <Box
          me="12px"
          borderRadius="50%"
          color={amountColor}
          border="1px solid"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="35px"
          h="35px"
        >
          <Icon as={icon} />
        </Box>
        <Flex direction="column">
          <Text
            fontSize={{ sm: "md", md: "lg", lg: "md" }}
            color={textColor}
            fontWeight="bold"
          >
            {title} {/* Updated to title */}
          </Text>
          <Text
            fontSize={{ sm: "xs", md: "sm", lg: "xs" }}
            color="gray.400"
            fontWeight="semibold"
          >
            {formattedDate}
          </Text>
        </Flex>
      </Flex>
      <Box color={amountColor}>
        <Text fontSize={{ sm: "md", md: "lg", lg: "md" }} fontWeight="bold">
          {formattedAmount}
        </Text>
      </Box>
    </Flex>
  );
}

export default TransactionRow;
