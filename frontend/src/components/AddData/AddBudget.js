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
  Alert, // Import Alert untuk menampilkan pesan sukses atau error
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert
import { useHistory } from "react-router-dom"; // Import useHistory
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const AddBudget = ({ isOpen, onClose, onSuccess, categoryName }) => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  const [budget, setBudget] = useState({});

  const [categoryId, setCategoryId] = useState("");
  const [categoryData, setCategoryData] = useState("");

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const [isLoading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [msg, setMsg] = useState("");

  const history = useHistory(); // Inisialisasi useHistory

  const [budgetCreated, setBudgetCreated] = useState(false); // New state to track budget creation

  // New useEffect to show SweetAlert notification
  useEffect(() => {
    if (budgetCreated) {
      Swal(
        "Create Budget Success",
        "Your budget has been created successfully!",
        "success"
      );
      setBudgetCreated(false); // Reset the state
    }
  }, [budgetCreated]);

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
            `https://api-spendwise.agilearn.id/users/${username}`
          );
          setUserId(response.data.data.id);
        }
      } catch (error) {
        console.error("Error getting user id:", error);
      }
    };
    getUserId();
  }, [username]);

  console.log("Category Name from URL:", categoryName);

  useEffect(() => {
    const fetchData = async () => {
      if (!username || !categoryName) return;

      try {
        const response = await axios.get(
          `https://api-spendwise.agilearn.id/categories/${username}`
        );
        console.log("Categories response data:", response.data.data);

        const categories = response.data.data || [];
        const foundCategory = categories.find((c) => c.name === categoryName);

        if (foundCategory) {
          console.log("Category found, ID:", foundCategory.id);
          setCategoryId(foundCategory.id);
        } else {
          console.log("Category with name", categoryName, "not found.");
          setMsg("Category not selected or does not exist.");
          setShowErrorMsg(true);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setMsg("Failed to fetch categories. Please try again.");
        setShowErrorMsg(true);
      }
    };

    fetchData();
  }, [username, categoryName]);

  const handleClose = () => {
    setLocalIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBudget((prevState) => ({ ...prevState, [name]: value }));
  };

  console.log("category_id:", categoryId);

  const saveBudget = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowErrorMsg(false); // Reset error message

    // Pastikan categoryId sudah di-set
    if (!categoryId) {
      console.error("Category ID is not set.");
      setShowErrorMsg(true);
      setMsg("Category not selected or does not exist.");
      setLoading(false);
      return;
    }

    // Validasi untuk memastikan semua field terisi
    if (!budget.title || !budget.amount || !budget.date) {
      setShowErrorMsg(true);
      setMsg("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const budgetData = {
        title: budget.title,
        amount: parseInt(budget.amount), // Pastikan amount adalah integer
        date: new Date(budget.date).toISOString(),
        category_id: parseInt(categoryId), // Pastikan category_id adalah integer
      };

      // Gunakan URL yang benar sesuai dengan setup server Anda
      const response = await axios.post(
        "https://api-spendwise.agilearn.id/budgets",
        budgetData
      );

      if (response.status === 201) {
        // Status 201 untuk created
        if (onSuccess) {
          onSuccess();
        }
        history.push(`/admin/budgets/${categoryName}`); // Redirect setelah sukses
        setShowSuccessAlert(true);
        setMsg("Category successfully created!");
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to create category. Please try again.");
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      setShowErrorMsg(true);
      setMsg(
        error.response?.data?.msg ||
          "Failed to create budget. Please try again."
      );
    } finally {
      setLoading(false);
      handleClose();
      setShowSuccessAlert(true); // Show the SweetAlert notification after the server request is complete
      Swal.fire({
        title: "Create Category Success",
        text: "Your category has been created successfully!",
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
        <form onSubmit={saveBudget}>
          <ModalContent
            style={{
              borderRadius: "20px", // Adjust the border-radius to your preference
            }}
          >
            <ModalHeader>Create your budget</ModalHeader>
            <ModalCloseButton onClick={handleClose} />
            <ModalBody pb={6}>
              {showSuccessAlert && <Alert severity="success">{msg}</Alert>}
              {showErrorMsg && <Alert severity="error">{msg}</Alert>}
              <FormControl>
                <FormLabel>Budget Name</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Budget Title"
                  name="title"
                  value={budget.title}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Amount</FormLabel>
                <Input
                  placeholder="Budget Amount"
                  name="amount"
                  value={budget.amount}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Date Created</FormLabel>
                <Input
                  placeholder="Select Date"
                  size="md"
                  name="date"
                  value={budget.date}
                  type="date"
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

export default AddBudget;
