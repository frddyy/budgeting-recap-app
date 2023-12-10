// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "components/Card/Card";
import PieChart from "components/Charts/PieChart";
import { VSeparator } from "components/Separator/Separator2";
import React, { useEffect, useState } from "react";

export default function Conversion(props) {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");

  const { ...rest } = props;
  const [username, setUsername] = useState("");
  const [pieChartData, setPieChartData] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("none");
  const [budgetData, setBudgetData] = useState([]);

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
            `https://api-spendwise.agilearn.id/budgets/${username}`
          );
          const data = response.data.budgets || [];
          setBudgetData(data);

          const months = new Set(
            data.map((item) =>
              new Date(item.date).toLocaleString("default", { month: "long" })
            )
          );
          setAvailableMonths(Array.from(months));

          const formattedData = data.map((item) => ({
            title: item.title,
            amount: item.amount_now,
          }));
          setPieChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth);

    const filteredData = budgetData
      .filter((item) => {
        const month = new Date(item.date).toLocaleString("default", {
          month: "long",
        });
        return month === selectedMonth;
      })
      .map((item) => ({
        title: item.title,
        amount: item.amount_now,
      }));

    setPieChartData(filteredData);
  };

  console.log("piechart budget :", pieChartData);

  // Rentang warna yang diberikan
  const colorRange = [
    "#4FD1C5",
    "#6AD2FF",
    "#F5587B",
    "#FF6B6B",
    "#FFD700",
    "#FF9A8B",
    "#9ACD32",
    "#FF6347",
    "#32CD32",
    "#836FFF",
    "#8A2BE2",
    "#FF69B4",
    // Tambahkan kode warna tambahan di sini sesuai kebutuhan
  ];

  // Fungsi untuk mendapatkan warna acak dalam rentang warna
  function getRandomColorInRange(range) {
    const startIndex = Math.floor(Math.random() * range.length);
    const endIndex = (startIndex + 1) % range.length;
    const startColor = range[startIndex];
    const endColor = range[endIndex];

    // Mengonversi warna ke nilai RGB
    function hexToRgb(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    }

    const startRgb = hexToRgb(startColor);
    const endRgb = hexToRgb(endColor);

    // Menghasilkan warna acak dalam rentang
    const randomColor = `rgb(${
      startRgb.r + Math.floor(Math.random() * (endRgb.r - startRgb.r + 2))
    }, ${
      startRgb.g + Math.floor(Math.random() * (endRgb.g - startRgb.g + 4))
    }, ${
      startRgb.b + Math.floor(Math.random() * (endRgb.b - startRgb.b + 8))
    })`;

    return randomColor;
  }

  // Menghasilkan warna acak
  const randomColor = getRandomColorInRange(colorRange);

  console.log(randomColor);

  const pieChartOptions = {
    labels: pieChartData.map((item) => item.title),
    colors: colorRange, // Gunakan palet warna berurutan
    chart: {
      width: "100%",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: colorRange, // Gunakan palet warna berurutan
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  console.log(
    "Final pie chart data for rendering:",
    pieChartData.map((item) => item.amount)
  );
  console.log("Pie chart options:", pieChartOptions);
  return (
    <Card
      p="0px"
      align="center"
      w="100%"
      border="none"
      shadow="none"
      mt="0px"
      {...rest}
    >
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent="space-between"
        alignItems="center"
        mt="0px"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontSize="lg" fontWeight="600" mb="4px">
          Your Category Budgeting
        </Text>
        <Select
          fontSize="sm"
          variant="subtle"
          value={selectedMonth}
          width="unset"
          fontWeight="700"
          onChange={handleMonthChange}
        >
          <option value="monthly">Select Monthly</option>
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </Select>
      </Flex>

      {selectedMonth !== "none" ? (
        pieChartData.length > 0 ? (
          <PieChart
            h="100%"
            w="100%"
            chartData={pieChartData.map((item) => item.amount)}
            chartOptions={pieChartOptions}
          />
        ) : (
          <Text color={textColor} fontSize="md" mt="65px" mb="73px">
            Select Monthly Category Budgeting
          </Text>
        )
      ) : (
        <Text color={textColor} fontSize="md" mt="65px" mb="73px">
          Select Monthly Category Budgeting
        </Text>
      )}
    </Card>
  );
}
