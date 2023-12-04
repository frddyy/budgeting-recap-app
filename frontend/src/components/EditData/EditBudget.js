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

const EditBudget = ({
  isOpen,
  onClose,
  onSuccess,
  budgetData,
  categoryName,
}) => {
  const [username, setUsername] = useState("");
  const [budget, setBudget] = useState({ title: "", amount: "" });

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

  // Gunakan budgetData untuk mengatur state
  useEffect(() => {
    if (isOpen && budgetData) {
      setBudget({
        title: budgetData.title,
        amount: parseInt(budgetData.amount),
        date: budgetData.date,
      });
    }
  }, [isOpen, budgetData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBudget((prevState) => ({ ...prevState, [name]: value }));
  };

  const updateBudget = async (e) => {
    e.preventDefault();
    setLoading(true);

    budget.amount = parseInt(budget.amount);
    budget.date = new Date(budget.date).toISOString();

    // Validasi untuk memastikan semua field terisi
    if (!budget.title || !budget.amount || !budget.date) {
      setShowErrorMsg(true);
      setMsg("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/budgets/${username}/${budgetData.id}`, // Gunakan budget.id
        budget
      );

      if (response.status === 200) {
        setShowSuccessAlert(true);
        setMsg("Budget successfully updated!");
        Swal.fire({
          title: "Update Budget Success",
          text: "Your budget has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload(); // Reload the page after user clicks "OK"
        });

        if (onSuccess) {
          onSuccess();
        }
        history.push(`/admin/budgets/${categoryName}`); // Sesuaikan path navigasi setelah update
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to update budget. Please try again.");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      setShowErrorMsg(true);
      setMsg("Failed to update budget. Please try again.");
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
      <form onSubmit={updateBudget}>
        <ModalContent>
          <ModalHeader>Edit your budget</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {showSuccessAlert && <Alert status="success">{msg}</Alert>}
            {showErrorMsg && <Alert status="error">{msg}</Alert>}
            <FormControl>
              <FormLabel>Budget Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Budget Title"
                name="title"
                value={budget.title}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Amount</FormLabel>
              <Input
                placeholder="Budget Amount"
                name="amount"
                value={budget.amount}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Date Created</FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="md"
                name="date"
                value={budget.date}
                type="datetime-local"
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
  );
};

export default EditBudget;
