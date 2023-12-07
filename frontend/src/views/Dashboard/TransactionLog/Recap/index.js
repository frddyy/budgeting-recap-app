// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
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
import TableIncomeRow from "components/Tables/TableIncomeRow";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Cookies from "js-cookie";
import TransactionsOverview from "./components/TransactionsOverview";
import LineChart from "components/Charts/LineChart";

const formatAmount = (amount) => {
  let formattedAmount = "";

  if (amount >= 1000000000) {
    // Untuk "B"
    const result = amount / 1000000000;
    formattedAmount = `${
      result % 1 === 0 ? result.toFixed(0) : result.toFixed(1)
    }B`;
  } else if (amount >= 1000000) {
    // Untuk "M"
    const result = amount / 1000000;
    formattedAmount = `${
      result % 1 === 0 ? result.toFixed(0) : result.toFixed(1)
    }M`;
  } else if (amount >= 1000) {
    // Untuk "K"
    const result = amount / 1000;
    formattedAmount = `${
      result % 1 === 0 ? result.toFixed(0) : result.toFixed(1)
    }K`;
  } else {
    // Tanpa konversi
    formattedAmount = amount.toFixed(0);
  }

  return `Rp ${formattedAmount}`;
};

// Fungsi untuk mengagregasi data berdasarkan tanggal
const aggregateDataByDate = (data) => {
  const groupedData = data.reduce((acc, item) => {
    const date = new Date(item.date).toDateString();
    if (!acc[date]) {
      acc[date] = { date, amount: 0 };
    }
    acc[date].amount += parseFloat(item.amount);
    return acc;
  }, {});
  const aggregatedData = Object.values(groupedData);
  console.log("Aggregated Data:", aggregatedData); // Debug
  return aggregatedData;
};


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
    show: false,
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
      gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
      inverseColors: true,
      opacityFrom: 0.8,
      opacityTo: 0,
      stops: [],
    },
    colors: ["#4FD1C5", "#2D3748"],
  },
  colors: ["#4FD1C5", "#2D3748"],
};

const Recap = ({ title }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [expenseData, setExpenseData] = useState([]); // Sudah benar, asalkan response API sesuai
  const [incomeData, setIncomeData] = useState([]); // Pastikan inisialisasi sebagai array kosong

  const [chartData, setChartData] = useState([]);

  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      fetchRecap(storedUsername);
    }
  }, []);

  const fetchRecap = async (username, startDate, endDate) => {
    try {
      // Panggilan API untuk data Expense dengan rentang tanggal
      const expenseResponse = await axios.get(
        `http://localhost:5000/expenses/${username}`,
        {
          params: { startDate, endDate },
        }
      );
      if (expenseResponse && expenseResponse.data) {
        setExpenseData(expenseResponse.data.expenses); // Pastikan menggunakan properti yang benar
      }

      // Panggilan API untuk data Income dengan rentang tanggal
      const incomeResponse = await axios.get(
        `http://localhost:5000/incomes/${username}`,
        {
          params: { startDate, endDate },
        }
      );

      if (incomeResponse && incomeResponse.data) {
        setIncomeData(incomeResponse.data.incomes); // Pastikan menggunakan properti yang benar
      }

      console.log("Expense data received:", expenseResponse.data);
      console.log("Income data received:", incomeResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Agregasi data
    const aggregatedExpenseData = aggregateDataByDate(expenseData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const aggregatedIncomeData = aggregateDataByDate(incomeData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  
    // Siapkan data untuk grafik
    const modifiedChartData = [
      {
        name: "Income",
        data: aggregatedIncomeData.map((item) => ({
          x: new Date(item.date).getTime(),
          y: item.amount,
        })),
        color: "#3EBD93",
      },
      {
        name: "Expense",
        data: aggregatedExpenseData.map((item) => ({
          x: new Date(item.date).getTime(),
          y: item.amount,
        })),
        color: "#F5587B",
      },
    ];
  
    setChartData(modifiedChartData);
  }, [expenseData, incomeData]);
  

  const handleGenerateClick = () => {
    const username = Cookies.get("username");
    console.log(
      `Generating report for ${username} from ${startDate} to ${endDate}`
    );
    fetchRecap(username, startDate, endDate);
    setIsGenerated(true); // Tambahkan baris ini
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
                <FormLabel>Start Date</FormLabel>
                <Input
                  placeholder="Select Date"
                  size="md"
                  name="date"
                  value={startDate}
                  type="date"
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>End Date</FormLabel>
                <Input
                  placeholder="Select Date"
                  size="md"
                  name="date"
                  value={endDate}
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
                />
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
              percentage={5} // You can calculate or update this percentage as needed
              chart={<LineChart data={chartData} />}
            />
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
                    <TableIncomeRow // Ganti dengan TableIncomeRow atau row yang sesuai
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

export default Recap;
