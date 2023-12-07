import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TableExpenseRow from "components/Tables/TableExpenseRow";
import TableIncomeRow from "components/Tables/TableIncomeRow"; // Import ini jika dibutuhkan
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import TransactionsOverview from "./components/TransactionsOverview";
import LineChart from "components/Charts/LineChart";

// Opsi untuk konfigurasi grafik (dapat disesuaikan)
export const lineChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    theme: "dark",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      style: {
        colors: "#c8cfca",
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#c8cfca",
        fontSize: "12px",
      },
    },
  },
  legend: {
    show: true,
  },
  grid: {
    strokeDashArray: 5,
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.5,
      inverseColors: true,
      opacityFrom: 0.8,
      opacityTo: 0,
    },
  },
  colors: ["#4FD1C5", "#2D3748"],
};


const Report = ({ title }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  const [selectedMonth, setSelectedMonth] = useState("");
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername && selectedMonth) {
      fetchReport(storedUsername, selectedMonth);
    }
  }, [selectedMonth]);

  const calculateMonthDates = (month) => {
    const year = new Date().getFullYear();
    const monthInt = parseInt(month, 10);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      console.error("Invalid month value:", month);
      return { startDate: null, endDate: null };
    }

    const startDate = new Date(year, monthInt - 1, 1);
    const endDate = new Date(year, monthInt, 0);
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const fetchReport = async (username, month) => {
    const { startDate, endDate } = calculateMonthDates(month);

    try {
      const expenseResponse = await axios.get(
        `https://api-spendwise.agilearn.id/expenses/${username}`,
        { params: { startDate, endDate } }
      );
      if (expenseResponse && expenseResponse.data) {
        setExpenseData(expenseResponse.data.expenses);
      }

      const incomeResponse = await axios.get(
        `https://api-spendwise.agilearn.id/incomes/${username}`,
        { params: { startDate, endDate } }
      );
      if (incomeResponse && incomeResponse.data) {
        setIncomeData(incomeResponse.data.incomes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const defaultChartData = [{ x: new Date().getTime(), y: 0 }];
  
    const incomeChartData = incomeData.length > 0
      ? incomeData.map((item) => ({
          x: new Date(item.date).getTime(),
          y: parseFloat(item.amount),
        }))
      : defaultChartData;
  
    const expenseChartData = expenseData.length > 0
      ? expenseData.map((item) => ({
          x: new Date(item.date).getTime(),
          y: parseFloat(item.amount),
        }))
      : defaultChartData;
  
    setChartData([
      { name: "Income", data: incomeChartData, color: "#3EBD93" },
      { name: "Expense", data: expenseChartData, color: "#F5587B" }
    ]);
  }, [expenseData, incomeData]);
  
  

  const handleGenerateClick = () => {
    const username = Cookies.get("username");
    if (username && selectedMonth) {
      setIsGenerated(true);
      fetchReport(username, selectedMonth);
    } else {
      console.warn("Username or month is not selected");
      setIsGenerated(false);
    }
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
                    borderRadius: "13px",
                  }}
                  placeholder="Select a month"
                >
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
      {isGenerated && (
        <CardBody>
          <Box w="100%">
            <TransactionsOverview
              title={"Transactions Overview"}
              percentage={5}
              chart={<LineChart data={chartData} />}
            />
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

            <Text
              fontSize="lg"
              color={textColor}
              fontWeight="bold"
              mt="6"
              mb="4"
            >
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
                    <TableIncomeRow
                      key={income.id}
                      index={index + 1}
                      income={income}
                      showActions={false}
                    />
                  ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      )}
    </Card>
  );
};

export default Report;
