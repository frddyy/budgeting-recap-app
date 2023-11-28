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
import AddExpense from "components/AddData/AddExpense";
import EditExpense from "components/EditData/EditExpense";

const Expenses = ({ title }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  const [expenseData, setExpenseData] = useState([]);
  const [username, setUsername] = useState("");
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState(null);
  
  const history = useHistory();

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchExpenses(storedUsername); // Fetch expenses after setting username
    }
  }, []);

  const fetchExpenses = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/expenses/${username}`
      );
      console.log("Full response:", response); // Log the full response

      // Accessing the expenses array from the response
      if (response && response.data && response.data.expenses) {
        setExpenseData(response.data.expenses); // Set the expenses array to state
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (expense_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/expenses/${username}/${expense_id}`
      );
      const updatedExpenseData = expenseData.filter(
        (expense) => expense.id !== expense_id
      );
      setExpenseData(updatedExpenseData);
    } catch (error) {
      console.error("Error deleting expense:", error);
      console.error("Detailed error response:", error.response); // Log the detailed error response
    }
  };

  const handleAddButton = () => {
    console.log("Add button clicked");
    setIsAddExpenseModalOpen(true);
  };

  const handleEdit = (expense) => {
    // Set the selectedExpense to the expense data that needs to be edited
    setSelectedExpense(expense);
    setIsEditExpenseModalOpen(true);
  };

  return (
    <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p="6px 0px 22px 0px">
        <Flex justify="space-between" align="center" minHeight="60px" w="100%">
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
            ADD NEW EXPENSE
          </Button>
        </Flex>
      </CardHeader>
      <CardBody>
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" pl="0px">
              <Th color="gray.400">No</Th>
              <Th color="gray.400">Title</Th>
              <Th color="gray.400">Amount</Th>
              <Th color="gray.400">Description</Th>
              <Th color="gray.400">Date</Th>
              <Th color="gray.400">Wallet</Th>
              <Th color="gray.400">Budget</Th>
              <Th color="gray.400">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {expenseData.map((expense, index) => (
              <TableExpenseRow
                key={expense.id}
                index={index + 1}
                expense={expense}
                onDelete={() => handleDelete(expense.id)}
                onEdit={() => handleEdit(expense)}
              />
            ))}
          </Tbody>
        </Table>
      </CardBody>
      <AddExpense
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        onSuccess={() => {
          // Fungsi yang akan dipanggil ketika expense berhasil ditambahkan
          setIsAddExpenseModalOpen(false);
          // Reload atau fetch ulang data expense di sini jika diperlukan
        }}
      />
      <EditExpense
        isOpen={isEditExpenseModalOpen}
        onClose={() => setIsEditExpenseModalOpen(false)}
        onSuccess={() => {
          // Perform any actions needed on successful addition
          setIsEditExpenseModalOpen(false);
        }}
        expenseData={selectedExpense} // Pass selectedExpense as expenseData
      />
    </Card>
  );
};

export default Expenses;
