// Chakra imports
import {
  Flex,
  SimpleGrid,
  Text,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
// Custom icons
import {
  CartIcon,
  RocketIcon,
  StatsIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Cookies from "js-cookie";
import { FaSackDollar as BudgetIcon } from "react-icons/fa6";

import ChartStatistics from "./ChartStatistics";

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

const ActiveUsers = ({ title, percentage, chart }) => {
  const iconBoxInside = useColorModeValue("white", "white");
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [specificCategoryData, setSpecificCategoryData] = useState(null); // State for data of a specific category

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (username) {
          const response = await axios.get(
            `https://api-spendwise.agilearn.id/categories/${username}`
          );
          const categories = response.data.data;
          if (categories && Array.isArray(categories)) {
            setCategoryData(categories);
          } else {
            console.error("Invalid category data received:", categories);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [username]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        if (username && selectedCategory) {
          const categoryName = encodeURIComponent(selectedCategory);
          const response = await axios.get(
            `https://api-spendwise.agilearn.id/budgets/${username}/${categoryName}`
          );
          const categoryData = response.data.budgets; // Access the budgets key
          console.log("data api", response);
          console.log("data kategori", categoryData);
          setSpecificCategoryData(categoryData);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, [username, selectedCategory]);

  const handleCategoryChange = (event) => {
    const categoryName = event.target.value;
    setSelectedCategory(categoryName);
  };

  // Kalkulasi persentase untuk ChartStatistics
  const calculatePercentage = (amountNow, totalAmount) => {
    if (totalAmount === 0) {
      return 0; // Avoid division by zero
    }
    return ((amountNow / totalAmount) * 100).toFixed(2);
  };

  useEffect(() => {
    if (categoryData.length === 0) {
      setSelectedCategory("");
    }
  }, [categoryData]);

  return (
    <Card p="16px">
      <CardBody>
        <Flex direction="column" w="100%">
          {chart}
          <Flex direction="column" mb="10px" alignSelf="flex-start">
            <Text
              fontSize="lg"
              color={useColorModeValue("gray.700", "white")}
              fontWeight="bold"
              mb="6px"
            >
              {title}
            </Text>
            {categoryData.length > 0 ? (
              <Select
                placeholder="Select category"
                onChange={handleCategoryChange}
                value={selectedCategory}
              >
                {categoryData.map((category, index) => (
                  <option value={category.name} key={index}>
                    {category.name}
                  </option>
                ))}
              </Select>
            ) : (
              <Text textAlign="center">No data category budget</Text>
            )}
          </Flex>
          <SimpleGrid
            gap={{ sm: "12px", md: "15px", xl: "15px" }}
            columns={4}
            m={"10px"}
          >
            {specificCategoryData &&
              specificCategoryData.map((data, index) => (
                <ChartStatistics
                  key={index}
                  title={data.title}
                  amount={formatAmount(data.amount_now)}
                  percentage={calculatePercentage(data.amount_now, data.amount)}
                  icon={
                    <BudgetIcon h={"15px"} w={"15px"} color={iconBoxInside} />
                  }
                />
              ))}
          </SimpleGrid>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ActiveUsers;
