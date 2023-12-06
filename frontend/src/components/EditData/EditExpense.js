import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Alert,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const EditExpense = ({ isOpen, onClose, onSuccess, expenseData }) => {
  const [expense, setExpense] = useState({
    id: "",
    title: "",
    amount: 0,
    description: "",
    date: "",
    wallet_id: null,
    budget_id: null,
  });
  const [username, setUsername] = useState("");
  const [wallets, setWallets] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const initialRef = useRef(null);

  const [isLoading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [msg, setMsg] = useState("");

  const history = useHistory();

  // Gunakan expenseData untuk mengatur state
  useEffect(() => {
    if (isOpen && expenseData) {
      setExpense({
        id: expenseData.id,
        title: expenseData.title,
        amount: expenseData.amount,
        description: expenseData.description,
        date: expenseData.date,
        wallet_id: expenseData.wallet_id,
        budget_id: expenseData.budget_id,
      });
    }
  }, [isOpen, expenseData]);

    useEffect(() => {
      const fetchWallets = async () => {
        try {
          const response = await axios.get(
            `http://194.233.93.124:7171/wallets/${username}`
          );
          const fetchedWallets = response.data.data || [];
          setWallets(fetchedWallets);

        // Set default wallet_id if wallets are available
        if (fetchedWallets.length > 0) {
          setExpense((prevState) => ({
            ...prevState,
            wallet_id: fetchedWallets[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };

      const fetchBudgets = async () => {
        try {
          const response = await axios.get(
            `http://194.233.93.124:7171/budgets/${username}`
          );
          const fetchedBudgets = response.data.budgets || [];
          setBudgets(fetchedBudgets);

        // Set default budget_id if budgets are available
        if (fetchedBudgets.length > 0) {
          setExpense((prevState) => ({
            ...prevState,
            budget_id: fetchedBudgets[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };
    if (username) {
      fetchWallets();
      fetchBudgets();
    }
  }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense((prevState) => ({ ...prevState, [name]: value }));
  };

  const updateExpense = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.patch(
        `http://194.233.93.124:7171/expenses/${username}/${expense.id}`,
        {
          ...expense,
          amount: parseFloat(expense.amount), // Ensure amount is an integer
          wallet_id: parseInt(expense.wallet_id), // Ensure amount is an integer
          budget_id: parseInt(expense.budget_id), // Ensure amount is an integer
        }
      );

      if (response.status === 200) {
        setShowSuccessAlert(true);
        setMsg("Expense successfully updated!");
        Swal.fire({
          title: "Update Expense Success",
          text: "Your expense has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload(); // Reload the page after user clicks "OK"
        });

        if (onSuccess) {
          onSuccess();
        }
        history.push("/admin/expenses");
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to update expense. Please try again.");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      setShowErrorMsg(true);
      setMsg("Failed to update expense. Please try again.");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleClose = () => {
    setShowSuccessAlert(false);
    setShowErrorMsg(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={handleClose}
      zIndex={10}
    >
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <form onSubmit={updateExpense}>
        <ModalContent
          style={{
            borderRadius: "20px", // Adjust the border-radius to your preference
          }}
        >
          <ModalHeader>Edit your expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {showSuccessAlert && <Alert status="success">{msg}</Alert>}
            {showErrorMsg && <Alert status="error">{msg}</Alert>}
            <FormControl>
              <FormLabel>Expense Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Expense Name"
                name="title"
                value={expense.title}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Amount</FormLabel>
              <Input
                placeholder="Amount"
                name="amount"
                type="number"
                value={expense.amount}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                name="description"
                value={expense.description}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Date</FormLabel>
              <Input
                placeholder="Date"
                name="date"
                type="date"
                value={expense.date}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Wallet</FormLabel>
              <Select name="wallet_id" onChange={handleInputChange}>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Budget</FormLabel>
              <Select name="budget_id" onChange={handleInputChange}>
                {budgets.map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.title}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              colorScheme="blue"
              mr={3}
              isLoading={isLoading}
            >
              Save
            </Button>
            <Button onClick={handleClose} colorScheme="red">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default EditExpense;
