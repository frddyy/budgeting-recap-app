// Chakra imports
import {
  Flex,
  Grid,
  Image,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// assets
import peopleImage from "assets/img/people-image.png";
import logoChakra from "assets/svg/logo-white.svg";
import PieChart from "views/Dashboard/Dashboard/components/PieChart";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Cookies from "js-cookie";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { dashboardTableData, timelineData } from "variables/general";
import ActiveUsers from "./components/ActiveUsers";
import BuiltByDevelopers from "./components/BuiltByDevelopers";
import MiniStatistics from "./components/MiniStatistics";
import MiniStatistics2 from "./components/MiniStatistics2";
import OrdersOverview from "./components/OrdersOverview";
import Projects from "./components/Projects";
import RecentTransactionsOverview from "./components/RecentTransactionsOverview";
import WorkWithTheRockets from "./components/WorkWithTheRockets";
import Transactions from "./components/Transactions";
import { FaSackDollar as BudgetIcon } from "react-icons/fa6";
import { GiPayMoney as ExpenseIcon } from "react-icons/gi";
import { GiReceiveMoney as IncomeIcon } from "react-icons/gi";
import { PersonIcon } from "components/Icons/Icons";

// Helper function to format balance
const formatBalanceToRp = (balance) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(balance);
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

// Fungsi untuk memeriksa apakah tanggal valid
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

export default function Dashboard() {
  const iconBoxInside = useColorModeValue("white", "white");
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [walletData, setWalletData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [username, setUsername] = useState("");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchTransactions(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await axios.get(
            `https://api-spendwise.agilearn.id/wallets/${username}`
          );
          const wallets = response.data.data || [];
          setWalletData(wallets);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  const groupTransactionsByDate = (transactions) => {
    const grouped = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    return grouped;
  };

  // Di dalam Dashboard.js

  // Function to process chart data
  const processChartData = (groupedTransactions) => {
    const incomeData = {};
    const expenseData = {};

    Object.entries(groupedTransactions).forEach(([date, transactions]) => {
      transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        if (isValidDate(transactionDate)) {
          const dateTimestamp = transactionDate.getTime();
          if (transaction.type === "income") {
            incomeData[dateTimestamp] =
              (incomeData[dateTimestamp] || 0) + transaction.amount;
          } else if (transaction.type === "expense") {
            expenseData[dateTimestamp] =
              (expenseData[dateTimestamp] || 0) + transaction.amount;
          }
        }
      });
    });

    const incomeSeries = Object.entries(
      incomeData
    ).map(([timestamp, total]) => ({ x: parseInt(timestamp), y: total }));

    const expenseSeries = Object.entries(
      expenseData
    ).map(([timestamp, total]) => ({ x: parseInt(timestamp), y: total }));

    return [
      { name: "Income", data: incomeSeries, color: "#4FD1C5" },
      { name: "Expense", data: expenseSeries, color: "#F5587B" },
    ];
  };

  const fetchTransactions = async (username) => {
    try {
      const incomesResponse = await axios.get(
        `https://api-spendwise.agilearn.id/incomes/${username}`
      );
      const expensesResponse = await axios.get(
        `https://api-spendwise.agilearn.id/expenses/${username}`
      );

      if (incomesResponse.data && expensesResponse.data) {
        const incomes = (incomesResponse.data.incomes || []).map((item) => ({
          ...item,
          type: "income",
        }));
        const expenses = (expensesResponse.data.expenses || []).map((item) => ({
          ...item,
          type: "expense",
        }));

        const combinedTransactions = [...incomes, ...expenses];
        if (combinedTransactions.length > 0) {
          combinedTransactions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          const latestTransactions = combinedTransactions.slice(0, 7);
          const groupedTransactions = groupTransactionsByDate(
            latestTransactions
          );
          setTransactions(groupedTransactions);
          const chartData = processChartData(groupedTransactions);
          setChartData(chartData);
        } else {
          setChartData([]);
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setChartData([]);
    }
  };

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
        <MiniStatistics
          title={"Total Balance"}
          number={formatBalanceToRp(totalBalance)}
          onTotalBalanceChange={setTotalBalance}
          icon={<BudgetIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics2
          walletData={walletData}
          icon={<WalletIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Total Income"}
          number={formatBalanceToRp(totalIncome)}
          onTotalIncomeChange={setTotalIncome}
          icon={<IncomeIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Total Expense"}
          number={formatBalanceToRp(totalExpense)}
          onTotalExpenseChange={setTotalExpense}
          icon={<ExpenseIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
      </SimpleGrid>
      <Grid
        templateColumns={{ md: "1fr", lg: "1.8fr 1.2fr" }}
        templateRows={{ md: "1fr auto", lg: "1fr" }}
        my="12px"
        gap="24px"
      >
        {/* <BuiltByDevelopers
          title={"Built by Developers"}
          name={"Purity UI Dashboard"}
          description={
            "From colors, cards, typography to complex elements, you will find the full documentation."
          }
          image={
            <Image
              src={logoChakra}
              alt="chakra image"
              minWidth={{ md: "300px", lg: "auto" }}
            />
          }
        />
        <WorkWithTheRockets
          backgroundImage={peopleImage}
          title={"Work with the rockets"}
          description={
            "Wealth creation is a revolutionary recent positive-sum game. It is all about who takes the opportunity first."
          }
        /> */}
      </Grid>
      <Grid
        templateColumns={{ sm: "1fr", lg: "1.3fr 1.7fr" }}
        templateRows={{ sm: "repeat(2, 1fr)", lg: "1fr" }}
        gap="25px"
      >
        <ActiveUsers
          title={"Select Category Budget"}
          percentage={23}
          chart={<PieChart />}
        />
        <RecentTransactionsOverview
          title={"Recent Transactions Overview"}
          chart={
            chartData && chartData.length > 0 ? (
              <LineChart data={chartData} />
            ) : (
              <div style={{ marginTop: "115px", textAlign: "center" }}>
                No Data Transactions Available
              </div> // Anda bisa mengganti teks ini sesuai kebutuhan
            )
          }
        />
      </Grid>
      <Grid
        templateColumns={{ sm: "1fr", md: "1fr", lg: "1fr" }}
        templateRows={{ sm: "1fr", md: "1fr", lg: "1fr" }}
        gap="25px"
      >
        <Transactions transactions={transactions} />

        {/* <Projects
          title={"Projects"}
          amount={30}
          captions={["Companies", "Members", "Budget", "Completion"]}
          data={dashboardTableData}
        /> */}
        {/* <OrdersOverview
          title={"Orders Overview"}
          amount={30}
          data={timelineData}
        /> */}
      </Grid>
    </Flex>
  );
}
