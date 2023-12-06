// Chakra imports
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Progress,
  useColorModeValue,
  SimpleGrid,
  Grid,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import AddBudget from "components/AddData/AddBudget";
import EditBudget from "components/EditData/EditBudget";
import BudgetStatistics from "./BudgetStatistics";
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import { BiSolidDollarCircle } from "react-icons/bi";

const Budgets = ({ title }) => {
  const [budgetData, setBudgetData] = useState([]);
  const [username, setUsername] = useState("");

  const history = useHistory();

  const textColor = useColorModeValue("gray.700", "white");
  const iconBoxInside = useColorModeValue("white", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState(false);
  const [currentEditBudget, setCurrentEditBudget] = useState(null);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const { category } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username && category) {
          const response = await axios.get(
            `http://194.233.93.124:7171/budgets/${username}/${category}`
          );
          // Pastikan respons memiliki properti 'budgets' dan merupakan array
          if (response.data && Array.isArray(response.data.budgets)) {
            setBudgetData(response.data.budgets);
          } else {
            // Jika 'budgets' tidak ada atau bukan array, tampilkan kesalahan
            setBudgetData([]); // Atur state dengan array kosong
            console.error("Data fetched is not an array:", response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setBudgetData([]); // Set state dengan array kosong jika terjadi kesalahan
      }
    };

    fetchData();
  }, [username, category]);

  const handleAddButton = () => {
    console.log("Add button clicked");
    setIsAddBudgetModalOpen(true);
  };

  const handleDelete = async (budgetId) => {
    // Tampilkan dialog konfirmasi dengan SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this budget?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika pengguna mengklik 'Yes'
        deleteBudget(budgetId);
      }
    });
  };
  
  const deleteBudget = async (budgetId) => {
    try {
      if (typeof budgetId !== "number") {
        console.error("Invalid budget ID:", budgetId);
        return;
      }
  
      const response = await axios.delete(
        `http://194.233.93.124:7171/budgets/${username}/${budgetId}`
      );
  
      if (response.status === 200) {
        const updatedBudgetData = budgetData.filter(
          (budget) => budget.id !== budgetId
        );
        setBudgetData(updatedBudgetData);
        console.log("Budget deleted successfully");
        Swal.fire(
          'Deleted!',
          'Your budget has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      Swal.fire(
        'Error',
        'Failed to delete the budget.',
        'error'
      );
    }
  };
  

  const handleEdit = async (budgetId) => {
    const selectedBudget = budgetData.find(
      (budget) => budget.id === budgetId
    );
    if (selectedBudget) {
      setCurrentEditBudget(selectedBudget); // Asumsikan Anda menambahkan state baru untuk ini
      setIsEditBudgetModalOpen(true);
    }
  };

  return (
    <Box>
      <Card mb={{ base: "30px", md: "20px" }}>
        <SimpleGrid columns={{ sm: 1, md: 1, xl: 1 }} spacing="24px">
          <CardHeader>
            <Flex
              justify="space-between"
              align="center"
              minHeight="30px"
              w="100%"
            >
              <Text fontSize="lg" color={textColor} fontWeight="bold">
                {title}
              </Text>
              <Button
                bg={bgButton}
                color="white"
                fontSize="xs"
                variant="no-hover"
                onClick={handleAddButton}
              >
                ADD NEW BUDGET
              </Button>
            </Flex>
          </CardHeader>
        </SimpleGrid>
      </Card>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 2 }} spacing="24px">
        {budgetData.map((budget, index) => {
          // Hitung persentase penggunaan budget
          const calculatePercentage = (amount_now, amount) => {
            if (amount === 0) {
              return 0; // Untuk menghindari pembagian dengan nol
            }
            return ((amount_now / amount) * 100).toFixed(2); // Pembulatan ke dua desimal
          };

          // Gunakan fungsi calculatePercentage untuk mendapatkan persentase untuk budget ini
          const percentageUsed = calculatePercentage(
            budget.amount_now,
            budget.amount
          );

          return (
            <BudgetStatistics
              key={index}
              title={budget.title}
              amount={budget.amount}
              amount_now={budget.amount_now}
              percentage={percentageUsed}
              date={budget.date}
              icon={
                <BiSolidDollarCircle
                  h={"50px"}
                  w={"50px"}
                  color={iconBoxInside}
                />
              }
              onEdit={() => handleEdit(budget.id)}
              onDelete={() => handleDelete(budget.id)}
            />
          );
        })}
      </SimpleGrid>

      <AddBudget
        isOpen={isAddBudgetModalOpen}
        onClose={() => setIsAddBudgetModalOpen(false)}
        onSuccess={() => {
          // Perform any actions needed on successful addition
          setIsAddBudgetModalOpen(false);
        }}
        categoryName={category}
      />

      <EditBudget
        isOpen={isEditBudgetModalOpen}
        onClose={() => setIsEditBudgetModalOpen(false)}
        onSuccess={() => {
          // Perform any actions needed on successful addition
          setIsEditBudgetModalOpen(false);
        }}
        budgetData={currentEditBudget}
        categoryName = {category}
      />
    </Box>
  );
};

export default Budgets;
