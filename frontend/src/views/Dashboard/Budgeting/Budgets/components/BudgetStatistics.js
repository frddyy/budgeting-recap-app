// Chakra imports
import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  Flex,
  SimpleGrid,
  Text,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody.js";
import IconBox from "components/Icons/IconBox";
import React from "react";
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

const BudgetStatistics = ({
  title,
  amount,
  amount_now,
  date,
  percentage,
  icon,
  onEdit,
  onDelete
}) => {
  const iconTeal = useColorModeValue("teal.300", "teal.300");
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  return (
    <Card minH="100px">
      <CardBody>
        <Flex flexDirection="row" align="center" justify="center" w="100%">
          <Stat me="auto" p="5px"> 
            <Flex width="100%" justifyContent="space-between" my="10px">
              <StatLabel
                fontSize="xl"
                color="gray.700"
                fontWeight="bold"
                pb=".1rem"
              >
                {title}
              </StatLabel>
              <StatHelpText
                alignSelf="flex-end"
                justifySelf="flex-end"
                m="0px"
                color="gray.500"
                fontWeight="bold"
                ps="3px"
                fontSize="sm"
                name="date"
              >
                {formatDate(date)}
              </StatHelpText>
            </Flex>
            <Flex>
              <StatNumber fontSize="lg" color={textColor}>
                {formatBalanceToRp(amount)} / {formatBalanceToRp(amount_now)}
              </StatNumber>
              {/* <StatHelpText
                alignSelf="flex-end"
                justifySelf="flex-end"
                m="0px"
                color={percentage > 0 ? "green.400" : "red.400"}
                fontWeight="bold"
                ps="3px"
                fontSize="md"
              >
                {percentage > 0 ? `+${percentage}%` : `${percentage}%`}
              </StatHelpText> */}
            </Flex>
            <Progress
              my="5px"
              me="12px"
              colorScheme={
                percentage <= 25 ? "red" : // Warna untuk <= 25%
                percentage <= 50 ? "yellow" : // Warna untuk <= 50%
                percentage <= 75 ? "cyan" : // Warna untuk <= 75%
                "teal" // Warna untuk <= 100%
              }
              size="md"
              value={percentage}
              borderRadius="15px"
            />
          </Stat>
          <IconBox as="box" h={"45px"} w={"45px"} bg={iconTeal} mt="20px">
            {icon}
          </IconBox>
        </Flex>
      </CardBody>
      <CardBody>
        <Flex width="100%" justifyContent="flex-end" mt={"5px"}>
          <ButtonGroup spacing="2">
            <Button variant="ghost" color="gray.700" colorScheme="gray"  onClick={() => onEdit()}>
              <Icon as={FaPencilAlt} me="4px" />
            </Button>
            <Button variant="ghost" color="red.500" colorScheme="red" onClick={() => onDelete()}>
              <Icon as={FaTrashAlt} me="4px" />
            </Button>
          </ButtonGroup>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default BudgetStatistics;
