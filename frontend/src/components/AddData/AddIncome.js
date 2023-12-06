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
  Select,
  Input,
  Alert, // Import Alert untuk menampilkan pesan sukses atau error
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert
import { useHistory } from "react-router-dom"; // Import useHistory

const AddIncome = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [income, setIncome] = useState({
    id: "",
    title: "",
    amount: 0,
    description: "",
    date: "",
    wallet_id: null,
  });
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const [isLoading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [msg, setMsg] = useState("");

  const history = useHistory(); // Inisialisasi useHistory

  const [incomeCreated, setIncomeCreated] = useState(false);
  const [wallets, setWallets] = useState([]);

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
          setIncome((prevState) => ({
            ...prevState,
            wallet_id: fetchedWallets[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };

    if (username) {
      fetchWallets();
    }
  }, [username]);
  // New useEffect to show SweetAlert notification
  useEffect(() => {
    if (incomeCreated) {
      Swal(
        "Create Income Success",
        "Your income has been created successfully!",
        "success"
      );
      setIncomeCreated(false); // Reset the state
    }
  }, [incomeCreated]);

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

    setIncome((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const saveIncome = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const incomeData = {
        title: income.title,
        amount: parseFloat(income.amount),
        description: income.description,
        date: new Date(income.date).toISOString(),
        wallet_id: parseInt(income.wallet_id),
        user_id: userId,
      };

      const response = await axios.post(
        "http://194.233.93.124:7171/incomes",
        incomeData
      );

      if (response.status === 200) {
        if (onSuccess) {
          onSuccess();
        }
        history.push("/admin/incomes");
        setShowSuccessAlert(true);
        setMsg("Income successfully created!");
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to create income. Please try again.");
      }
    } catch (error) {
      console.error("Error saving income:", error);
      setShowErrorMsg(true);
      setMsg("Failed to create income. Please try again.");
    } finally {
      setLoading(false);
      handleClose();
      setShowSuccessAlert(true); // Show the SweetAlert notification after the server request is complete
      Swal.fire({
        title: "Create Income Success",
        text: "Your income has been created successfully!",
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
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <form onSubmit={saveIncome}>
          <ModalContent
            style={{
              borderRadius: "20px", // Adjust the border-radius to your preference
            }}
          >
            <ModalHeader>Create your income</ModalHeader>
            <ModalCloseButton onClick={handleClose} />
            <ModalBody pb={6}>
              {showSuccessAlert && <Alert severity="success">{msg}</Alert>}
              {showErrorMsg && <Alert severity="error">{msg}</Alert>}
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Title"
                  name="title"
                  value={income.title}
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
                  value={income.amount}
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
                  value={income.description}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Date</FormLabel>
                <Input
                  name="date"
                  placeholder="Select Date and Time"
                  size="md"
                  type="date"
                  value={income.date}
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

export default AddIncome;
