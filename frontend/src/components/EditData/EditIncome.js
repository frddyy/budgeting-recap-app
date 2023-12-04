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

const EditIncome = ({ isOpen, onClose, onSuccess, incomeData }) => {
  const [income, setIncome] = useState({
    id: "",
    title: "",
    amount: 0,
    description: "",
    date: "",
    wallet_id: null,
  });
  const [username, setUsername] = useState("");
  const [wallets, setWallets] = useState([]);

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

  useEffect(() => {
    if (isOpen && incomeData) {
      setIncome({
        id: incomeData.id,
        title: incomeData.title,
        amount: incomeData.amount,
        description: incomeData.description,
        date: incomeData.date,
        wallet_id: incomeData.wallet_id,
      });
    }
  }, [isOpen, incomeData]);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/wallets/${username}`
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncome((prevState) => ({ ...prevState, [name]: value }));
  };

  const updateIncome = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.patch(
        `http://localhost:5000/incomes/${username}/${income.id}`,
        {
          ...income,
          date: new Date(income.date).toISOString(),
          amount: parseFloat(income.amount),
        }
      );

      if (response.status === 200) {
        setShowSuccessAlert(true);
        setMsg("Income successfully updated!");
        Swal.fire({
          title: "Update Income Success",
          text: "Your income has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload(); // Reload the page after user clicks "OK"
        });

        if (onSuccess) {
          onSuccess();
        }
        history.push("/admin/incomes");
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to update income. Please try again.");
      }
    } catch (error) {
      console.error("Error updating income:", error);
      setShowErrorMsg(true);
      setMsg("Failed to update income. Please try again.");
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
      <ModalOverlay />
      <form onSubmit={updateIncome}>
        <ModalContent>
          <ModalHeader>Edit your income</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {showSuccessAlert && <Alert status="success">{msg}</Alert>}
            {showErrorMsg && <Alert status="error">{msg}</Alert>}
            <FormControl>
              <FormLabel>Income Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Income Name"
                name="title"
                value={income.title}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Amount</FormLabel>
              <Input
                placeholder="Amount"
                name="amount"
                type="number"
                value={income.amount}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                name="description"
                value={income.description}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Date</FormLabel>
              <Input
                placeholder="Date"
                name="date"
                type="date"
                value={income.date}
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

export default EditIncome;
