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

const AddCategory = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  const [category, setCategory] = useState({ name: "" });
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const [isLoading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [msg, setMsg] = useState("");

  const history = useHistory(); // Inisialisasi useHistory

  const [categoryCreated, setCategoryCreated] = useState(false); // New state to track wallet creation

  // New useEffect to show SweetAlert notification
  useEffect(() => {
    if (categoryCreated) {
      Swal(
        "Create Category Success",
        "Your category has been created successfully!",
        "success"
      );
      setCategoryCreated(false); // Reset the state
    }
  }, [categoryCreated]);

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
    setCategory((prevState) => ({ ...prevState, [name]: value }));
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        ...category,
        user_id: userId,
      };

      const response = await axios.post(
        "http://194.233.93.124:7171/categories",
        categoryData
      );

      if (response.status === 201) {
        if (onSuccess) {
          onSuccess();
        }
        history.push("/admin/budgeting");
        setShowSuccessAlert(true);
        setMsg("Category successfully created!");
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to create category. Please try again.");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setShowErrorMsg(true);
      setMsg("Failed to create category. Please try again.");
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
        <form onSubmit={saveCategory}>
          <ModalContent
            style={{
              borderRadius: "20px", // Adjust the border-radius to your preference
            }}
          >
            <ModalHeader>Create your category</ModalHeader>
            <ModalCloseButton onClick={handleClose} />
            <ModalBody pb={6}>
              {showSuccessAlert && <Alert severity="success">{msg}</Alert>}
              {showErrorMsg && <Alert severity="error">{msg}</Alert>}
              <FormControl>
                <FormLabel>Category Name</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Category Name"
                  name="name"
                  value={category.name}
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

export default AddCategory;
