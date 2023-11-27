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
  Alert,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const EditIncome = ({ isOpen, onClose, onSuccess, incomeData }) => {
  const [income, setIncome] = useState({ name: "", balance: "" });
  const [username, setUsername] = useState("");

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
        name: incomeData.name,
        balance: incomeData.balance,
      });
    }
  }, [isOpen, incomeData]);

  const fetchIncomeData = async (incomeName) => {
    if (!username) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/incomes/${username}/${incomeName}`
      );
      if (response.status === 200) {
        setIncome({
          name: response.data.name, // Asumsi 'name' adalah properti dari data yang diterima
          balance: response.data.balance, // Asumsi 'balance' adalah properti dari data yang diterima
        });
      }
    } catch (error) {
      console.error("Error fetching income:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncome((prevState) => ({ ...prevState, [name]: value }));
  };

  const updateIncome = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.patch(
        `http://localhost:5000/incomes/${username}/${income.name}`, // Gunakan income.name
        income
      );

      if (response.status === 200) {
        setShowSuccessAlert(true);
        setMsg("Income successfully updated!");
        Swal.fire({
          title: "Update Income Success",
          text: "Your Income has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload(); // Reload the page after user clicks "OK"
        });

        if (onSuccess) {
          onSuccess();
        }
        history.push("/admin/income");
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
    <>
      <Modal
        initialFocusRef={initialRef}
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
        <form onSubmit={updateIncome}>
          <ModalContent
            style={{
              borderRadius: "20px", // Adjust the border-radius to your preference
            }}
          >
            <ModalHeader>Edit your income</ModalHeader>
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
                  placeholder="Balance"
                  name="balance"
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
                  type="datetime-local"
                  value={income.date}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Wallet</FormLabel>
                <Input
                  placeholder="Wallet"
                  name="wallet"
                  value={income.wallet_id}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
                />
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

export default EditIncome;
