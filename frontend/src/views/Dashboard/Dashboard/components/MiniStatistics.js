// Chakra imports
import {
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import IconBox from "components/Icons/IconBox";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Cookies from "js-cookie";

const MiniStatistics = ({
  title,
  amount,
  percentage,
  icon,
  onTotalBalanceChange,
  onTotalWalletChange,
  onTotalIncomeChange,
  onTotalExpenseChange,
  number,
}) => {
  const iconTeal = useColorModeValue("teal.300", "teal.300");
  const textColor = useColorModeValue("gray.700", "white");

  const [walletData, setWalletData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [username, setUsername] = useState("");
  const history = useHistory();

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await axios.get(
            `http://localhost:5000/wallets/${username}`
          );
          const wallets = response.data.data || [];
          setWalletData(wallets);

          const totalBalance = wallets.reduce(
            (acc, wallet) => acc + wallet.balance,
            0
          );
          onTotalBalanceChange(totalBalance); // Mengirim totalBalance ke komponen induk
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username, onTotalBalanceChange]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await axios.get(
            `http://localhost:5000/incomes/${username}`
          );
          console.log(response.data); // Tambahkan ini untuk memeriksa respon

          const incomes = response.data.incomes || [];
          setIncomeData(incomes);
          console.log("incomeData: ", incomeData);

          const totalIncome = incomes.reduce(
            (acc, income) => acc + income.amount,
            0
          );

          onTotalIncomeChange(totalIncome);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username, onTotalIncomeChange]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await axios.get(
            `http://localhost:5000/expenses/${username}`
          );
          console.log(response.data); // Tambahkan ini untuk memeriksa respon

          const expenses = response.data.expenses || [];
          setExpenseData(expenses);
          console.log("expenseData: ", expenseData);

          const totalExpense = expenses.reduce(
            (acc, expense) => acc + expense.amount,
            0
          );

          onTotalExpenseChange(totalExpense);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username, onTotalExpenseChange]);

  console.log("onTotalIncomeChange type:", typeof onTotalIncomeChange);

  return (
    <Card minH="83px">
      <CardBody>
        <Flex
          flexDirection="row"
          align="center"
          justify="space-between"
          w="100%"
          m="5px"
        >
          <Stat me="auto">
            <StatLabel
              fontSize="sm"
              color="gray.400"
              fontWeight="bold"
              pb=".1rem"
            >
              {title}
            </StatLabel>
            <Flex>
              <StatNumber fontSize="lg" color={textColor}>
                {number}
              </StatNumber>
              <StatHelpText
                alignSelf="flex-end"
                justifySelf="flex-end"
                m="0px"
                color={percentage > 0 ? "green.400" : "red.400"}
                fontWeight="bold"
                ps="3px"
                fontSize="md"
              ></StatHelpText>
            </Flex>
          </Stat>
          <IconBox as="box" h={"45px"} w={"45px"} bg={iconTeal}>
            {icon}
          </IconBox>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default MiniStatistics;
