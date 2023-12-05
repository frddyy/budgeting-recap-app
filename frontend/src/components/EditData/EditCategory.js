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

const EditCategory = ({ isOpen, onClose, onSuccess, categoryData }) => {
  const [category, setCategory] = useState({ name: "" });
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

  // Gunakan categoryData untuk mengatur state
  useEffect(() => {
    if (isOpen && categoryData) {
      setCategory({
        name: categoryData.name,
      });
    }
  }, [isOpen, categoryData]);

  const fetchCategoryData = async (categoryName) => {
    if (!username) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/categories/${username}/${categoryName}`
      );
      if (response.status === 200) {
        // Setelah mendapatkan data dari API, update state 'category'
        setCategory({
          name: response.data.name, // Asumsi 'name' adalah properti dari data yang diterima
        });
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevState) => ({ ...prevState, [name]: value }));
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.patch(
        `http://localhost:5000/categorys/${username}/${category.name}`, // Gunakan category.name
        category
      );

      if (response.status === 200) {
        setShowSuccessAlert(true);
        setMsg("Category successfully updated!");
        Swal.fire({
          title: "Update Category Success",
          text: "Your category has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload(); // Reload the page after user clicks "OK"
        });

        if (onSuccess) {
          onSuccess();
        }
        history.push("/admin/budgeting");
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to update category. Please try again.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setShowErrorMsg(true);
      setMsg("Failed to update category. Please try again.");
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
      <form onSubmit={updateCategory}>
        <ModalContent
          style={{
            borderRadius: "20px", // Adjust the border-radius to your preference
          }}
        >
          <ModalHeader>Edit your category</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {showSuccessAlert && <Alert status="success">{msg}</Alert>}
            {showErrorMsg && <Alert status="error">{msg}</Alert>}
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Category Name"
                name="name"
                value={category.name}
                onChange={handleInputChange}
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

export default EditCategory;
