// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TableExpenseRow from "components/Tables/TableExpenseRow";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Cookies from "js-cookie";
import ActiveUsers from "./components/ActiveUsers";
import SalesOverview from "./components/SalesOverview";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";

const Report = ({ title }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  const [selectedMonth, setSelectedMonth] = useState("");

  const [expenseData, setExpenseData] = useState([]); // Sudah benar, asalkan response API sesuai
  const [incomeData, setIncomeData] = useState([]); // Pastikan inisialisasi sebagai array kosong

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      fetchReport(storedUsername);
    }
  }, []);

  // Function to calculate start and end dates of the selected month
  const calculateMonthDates = (month) => {
    const year = new Date().getFullYear(); // Assuming current year
    // Ensure the month is a number and within the valid range
    const monthInt = parseInt(month, 10);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      console.error("Invalid month value:", month);
      return { startDate: null, endDate: null };
    }

    const startDate = new Date(year, monthInt - 1, 1);
    const endDate = new Date(year, monthInt, 0);

    // Convert dates to ISO format
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  // Update the rest of the code as previously suggested

  const fetchReport = async (username, month) => {
    const { startDate, endDate } = calculateMonthDates(month);

    try {
      // Panggilan API untuk data Expense dengan rentang tanggal
      const expenseResponse = await axios.get(
        `http://localhost:5000/expenses/${username}`,
        {
          params: { startDate, endDate },
        }
      );
      if (expenseResponse && expenseResponse.data) {
        setExpenseData(expenseResponse.data.expense);
      }

      // Panggilan API untuk data Income dengan rentang tanggal
      const incomeResponse = await axios.get(
        `http://localhost:5000/incomes/${username}`,
        {
          params: { startDate, endDate },
        }
      );
      if (incomeResponse && incomeResponse.data) {
        setIncomeData(incomeResponse.data.income);
      }

      console.log("Expense data received:", expenseResponse.data);
      console.log("Income data received:", incomeResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    console.log("Updated expenses:", expenseData);
  }, [expenseData]);

  useEffect(() => {
    console.log("Updated incomes:", incomeData);
  }, [incomeData]);

  const handleGenerateClick = () => {
    const username = Cookies.get("username");
    console.log(`Generating report for ${username} from ${selectedMonth}`);
    fetchReport(username, selectedMonth);
  };

  return (
    <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p="6px 0px 22px 0px">
        <Flex
          justify="space-between"
          align="center"
          minHeight="60px"
          w="100%"
          direction={"column"}
        >
          <Text fontSize="lg" color={textColor} fontWeight="bold">
            {title}
          </Text>
          <Flex justifyContent="space-between" w="100%">
            <Flex gap={4}>
              <FormControl mt={4}>
                <FormLabel>Choose month</FormLabel>
                <Select
                  size="md"
                  name="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
                  placeholder="Select a month" // Add this line for placeholder
                >
                  <option value="">Select a month</option>{" "}
                  {/* Add this line for default option */}
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </Select>
              </FormControl>
            </Flex>

            <Button
              mt={12}
              w="auto"
              bg={bgButton}
              color="white"
              fontSize="xs"
              variant="no-hover"
              onClick={handleGenerateClick}
            >
              GENERATE
            </Button>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Box w="100%">
          {/* Expense Log Table */}
          <Text fontSize="lg" color={textColor} fontWeight="bold" mb="4">
            Expense Log
          </Text>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr>
                <Th color="gray.400">No</Th>
                <Th color="gray.400">Title</Th>
                <Th color="gray.400">Amount</Th>
                <Th color="gray.400">Description</Th>
                <Th color="gray.400">Date</Th>
                <Th color="gray.400">Wallet</Th>
                <Th color="gray.400">Budget</Th>
              </Tr>
            </Thead>
            <Tbody>
              {expenseData &&
                expenseData.map((expense, index) => (
                  <TableExpenseRow
                    key={expense.id}
                    index={index + 1}
                    expense={expense}
                    showActions={false}
                  />
                ))}
            </Tbody>
          </Table>

          {/* Income Log Table */}
          <Text fontSize="lg" color={textColor} fontWeight="bold" mt="6" mb="4">
            Income Log
          </Text>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr>
                <Th color="gray.400">No</Th>
                <Th color="gray.400">Title</Th>
                <Th color="gray.400">Amount</Th>
                <Th color="gray.400">Description</Th>
                <Th color="gray.400">Date</Th>
                <Th color="gray.400">Wallet</Th>
              </Tr>
            </Thead>
            <Tbody>
              {incomeData &&
                incomeData.map((income, index) => (
                  <TableIncomeRow // Ganti dengan TableIncomeRow atau row yang sesuai
                    key={income.id}
                    index={index + 1}
                    income={income}
                    showActions={false}
                  />
                ))}
            </Tbody>
          </Table>

          {/* Grafik untuk Expense dan Income */}
          <Box mt="6">
            <Text fontSize="lg" color={textColor} fontWeight="bold" mb="4">
              Expense Chart
            </Text>
            {/* Render BarChart disini dengan data expenseData */}
            <BarChart data={expenseData} />
          </Box>

          <Box mt="6">
            <Text fontSize="lg" color={textColor} fontWeight="bold" mb="4">
              Income Chart
            </Text>
            {/* Render LineChart disini dengan data incomeData */}
            <LineChart data={incomeData} />
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export default Report;
