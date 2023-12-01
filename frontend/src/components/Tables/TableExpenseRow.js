import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  Tr,
  Td,
  Flex,
  Text,
  Icon,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

const formatBalanceToRp = (balance) => {
  const formattedBalance = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(balance);
  return formattedBalance;
};

const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

function TableExpenseRow({ expense, onEdit, onDelete, index, showActions }) {
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("#F8F9FA", "gray.800");

  return (
    <Tr overflowX="scroll">
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {index}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {expense.title}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {formatBalanceToRp(expense.amount)}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {expense.description}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {formatDate(expense.date)}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {expense.wallet.name}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {expense.budget.title}
        </Text>
      </Td>
      {showActions && (
        <Td>
          <Flex
            direction={{ sm: "column", md: "column" }}
            align="flex-start"
            p={{ md: "24px" }}
          >
            <Button
              p="0px"
              bg="transparent"
              mb={{ sm: "10px", md: "0px" }}
              me={{ md: "12px" }}
              onClick={() => onEdit(expense.id)}
            >
              <Flex color={textColor} cursor="pointer" align="center" p="12px">
                <Icon as={FaPencilAlt} me="4px" />
              </Flex>
            </Button>
            <Button p="0px" bg="transparent" onClick={onDelete}>
              <Flex color="red.500" cursor="pointer" align="center" p="12px">
                <Icon as={FaTrashAlt} me="4px" />
              </Flex>
            </Button>
          </Flex>
        </Td>
      )}
    </Tr>
  );
}

export default TableExpenseRow;
