import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import {
  Tr,
  Td,
  Flex,
  Text,
  Icon,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { BiSolidShow } from "react-icons/bi";

function TableCategoryRow({ category, onShow, onDelete, index }) {
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("#F8F9FA", "gray.800");

  return (
    <Tr>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {index}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {category.name}
        </Text>
      </Td>
      <Td>
        <Flex
          direction={{ sm: "column", md: "row" }}
          align="flex-start"
          p={{ md: "24px" }}
        >
          <Button
            p="0px"
            bg="transparent"
            mb={{ sm: "10px", md: "0px" }}
            me={{ md: "12px" }}
            onClick={() => onShow(category.name)}
          >
            <Flex color={textColor} cursor="pointer" align="center" p="12px">
              <Icon as={BiSolidShow} me="4px" />
              <Text fontSize="sm" fontWeight="semibold">
                SHOW
              </Text>
            </Flex>
          </Button>
          <Button p="0px" bg="transparent" onClick={onDelete}>
            <Flex color="red.500" cursor="pointer" align="center" p="12px">
              <Icon as={FaTrashAlt} me="4px" />
              <Text fontSize="sm" fontWeight="semibold">
                DELETE
              </Text>
            </Flex>
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
}

export default TableCategoryRow;
