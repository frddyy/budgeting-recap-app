// Chakra imports
import {
  Button,
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  SimpleGrid,
  Grid,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TableIncomeRow from "components/Tables/TableIncomeRow";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Cookies from "js-cookie";
import AddIncome from "components/AddData/AddIncome";
import EditIncome from "components/EditData/EditIncome";
import Swal from "sweetalert2";

const Incomes = ({ title, onTotalAmountChange }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );
  // const dummyData = [
  //   {
  //     id: 1,
  //     title: "Gaji",
  //     amount: 5000000,
  //     description: "Gaji bulanan",
  //     date: "2023-01-01",
  //     wallet: "Dompet Utama",
  //   },
  //   {
  //     id: 2,
  //     title: "Bonus",
  //     amount: 1500000,
  //     description: "Bonus proyek",
  //     date: "2023-01-15",
  //     wallet: "Dompet Sampingan",
  //   },
  //   // Tambahkan lebih banyak data jika diperlukan
  // ];

  const [incomeData, setIncomeData] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
  const [isEditIncomeModalOpen, setIsEditIncomeModalOpen] = useState(false);
  const [currentEditIncome, setCurrentEditIncome] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/incomes/${username}`
        );
        console.log("Full API Response:", response);

        if (response.data && response.data.incomes) {
          const incomes = response.data.incomes;
          setIncomeData(incomes);

          const totalAmount = incomes.reduce(
            (acc, income) => acc + income.amount,
            0
          );
          onTotalAmountChange(totalAmount);
        } else {
          console.log("No incomes data received from API");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  const handleAddButton = () => {
    console.log("Add button clicked");
    setIsAddIncomeModalOpen(true);
  };

  const handleDelete = async (incomeTitle) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/incomes/${username}/${incomeTitle}`
      );
      const updatedIncomeData = incomeData.filter(
        (income) => income.title !== incomeTitle
      );
      setIncomeData(updatedIncomeData);
    } catch (error) {
      console.error("Error deleting income:", error);
      console.error("Detailed error response:", error.response); // Log the detailed error response
    } finally {
      setLoading(false);
      setShowSuccessAlert(true); // Show the SweetAlert notification after the server request is complete
      Swal.fire({
        title: "Delete Income Success",
        text: "Delete income has been successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // Reload the page after user clicks "OK"
      });
    }
  };

  const handleEdit = (incomeTitle) => {
    const selectedIncome = incomeData.find(
      (income) => income.title === incomeTitle
    );
    if (selectedIncome) {
      setCurrentEditIncome(selectedIncome); // Asumsikan Anda menambahkan state baru untuk ini
      setIsEditIncomeModalOpen(true);
    }
  };

  return (
    <Card my="20px" overflowX={{ sm: "scroll", xl: "hidden" }}>
      <SimpleGrid columns={{ sm: 1, md: 1, xl: 1 }} spacing="24px">
        <CardHeader p="6px 30px 30px 22px">
          <Flex
            justify="space-between"
            align="center"
            minHeight="60px"
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
              ADD NEW INCOME
            </Button>
          </Flex>
        </CardHeader>
      </SimpleGrid>
      <CardBody>
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" pl="0px">
              <Th color="gray.400" textAlign="center">
                No
              </Th>
              <Th color="gray.400">Title</Th>
              <Th color="gray.400">Amount</Th>
              <Th color="gray.400">Description</Th>
              <Th color="gray.400">Date</Th>
              <Th color="gray.400">Wallet</Th>
              <Th color="gray.400" textAlign="center">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {incomeData.map((income, index) => (
              <TableIncomeRow
                key={income.id}
                index={index + 1}
                income={income}
                onDelete={() => handleDelete(income.title)}
                onEdit={() => handleEdit(income.title)}
              />
            ))}
          </Tbody>
        </Table>
      </CardBody>

      <EditIncome
        isOpen={isEditIncomeModalOpen}
        onClose={() => setIsEditIncomeModalOpen(false)}
        onSuccess={() => {
          // Perform any actions needed on successful addition
          setIsEditIncomeModalOpen(false);
        }}
        incomeData={currentEditIncome}
      />

      <AddIncome
        isOpen={isAddIncomeModalOpen}
        onClose={() => setIsAddIncomeModalOpen(false)}
        onSuccess={() => {
          // Perform any actions needed on successful addition
          setIsAddIncomeModalOpen(false);
        }}
      />
    </Card>
  );
};

export default Incomes;
