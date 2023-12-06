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
  Alert, // Import Alert untuk menampilkan pesan sukses atau error
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert
import { useHistory } from "react-router-dom"; // Import useHistory

const AddExpense = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [expense, setExpense] = useState({
    id: "",
    title: "",
    amount: 0,
    description: "",
    date: "",
    wallet_id: null,
    budget_id: null,
  });
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const [isLoading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [msg, setMsg] = useState("");

  const history = useHistory(); // Inisialisasi useHistory

  const [expenseCreated, setExpenseCreated] = useState(false); // New state to track expense creation

  const [wallets, setWallets] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // useEffect existing...

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
  // New useEffect to show SweetAlert notification
  useEffect(() => {
    if (expenseCreated) {
      Swal(
        "Create Expense Success",
        "Your expense has been created successfully!",
        "success"
      );
      setExpenseCreated(false); // Reset the state
    }
  }, [expenseCreated]);

  console.log("username:", username);
  console.log("user_id:", userId);
  console.log("user_id type:", typeof userId);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      try {
        if (username) {
          const response = await axios.get(
            `http://194.233.93.124:7171/users/${username}`
          );
          setUserId(response.data.data.id);
        }
      } catch (error) {
        console.error("Error getting user id:", error);
      }
    };
    getUserId();
  }, [username]);

  const handleClose = () => {
    setLocalIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setExpense((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const saveExpense = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expenseData = {
        title: expense.title,
        amount: parseFloat(expense.amount),
        description: expense.description,
        date: new Date(expense.date).toISOString(),
        wallet_id: parseInt(expense.wallet_id),
        budget_id: parseInt(expense.budget_id),
        user_id: userId,
      };

      const response = await axios.post(
        "http://194.233.93.124:7171/expenses",
        expenseData
      );

      if (response.status === 200) {
        if (onSuccess) {
          onSuccess();
        }
        history.push("/admin/expenses");
        setShowSuccessAlert(true);
        setMsg("Expense successfully created!");
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to create expense. Please try again.");
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      setShowErrorMsg(true);
      setMsg("Failed to create expense. Please try again.");
    } finally {
      setLoading(false);
      handleClose();
      setShowSuccessAlert(true); // Show the SweetAlert notification after the server request is complete
      Swal.fire({
        title: "Create Expense Success",
        text: "Your expense has been created successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // Reload the page after user clicks "OK"
      });
    }
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={handleClose}
        zIndex={10}
      >
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <form onSubmit={saveExpense}>
          <ModalContent
            style={{
              borderRadius: "20px", // Adjust the border-radius to your preference
            }}
          >
            <ModalHeader>Create your expense</ModalHeader>
            <ModalCloseButton onClick={handleClose} />
            <ModalBody pb={6}>
              {showSuccessAlert && <Alert severity="success">{msg}</Alert>}
              {showErrorMsg && <Alert severity="error">{msg}</Alert>}
              <FormControl>
                <FormLabel>Expense Name</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Expense Name"
                  name="title"
                  value={expense.title}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
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
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Description"
                  name="description"
                  value={expense.description}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
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
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
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
    </>
  );
};

export default AddExpense;
