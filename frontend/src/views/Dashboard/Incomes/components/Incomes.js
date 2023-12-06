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

  const [incomeData, setIncomeData] = useState([]);
  const [username, setUsername] = useState("");
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
  const [isEditIncomeModalOpen, setIsEditIncomeModalOpen] = useState(false);

  const [selectedIncome, setSelectedIncome] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchIncomes(storedUsername);
    }
  }, []);

  const fetchIncomes = async (username) => {
    try {
      const response = await axios.get(
        `http://194.233.93.124:7171/incomes/${username}`
      );
      console.log("Full response:", response); // Log the full response

      if (response && response.data && response.data.incomes) {
        setIncomeData(response.data.incomes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (income_id) => {
    try {
      const response = await axios.delete(
        `http://194.233.93.124:7171/incomes/${username}/${income_id}`
      );
      const updatedIncomeData = incomeData.filter(
        (income) => income.id !== income_id
      );
      setIncomeData(updatedIncomeData);
    } catch (error) {
      console.error("Error deleting income:", error);
      console.error("Detailed error response:", error.response); // Log the detailed error response
    }
  };

  const handleAddButton = () => {
    console.log("Add button clicked");
    setIsAddIncomeModalOpen(true);
  };

  const handleEdit = (income) => {
    setSelectedIncome(income);
    setIsEditIncomeModalOpen(true);
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
                onDelete={() => handleDelete(income.id)}
                onEdit={() => handleEdit(income)}
                showActions={true}
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
        incomeData={selectedIncome}
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