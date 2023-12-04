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

const EditUser = ({ isOpen, onClose, onSuccess, userData }) => {
  const [user, setUser] = useState({
    id: "",
    email: "",
    full_name: "",
    image: null,
  });
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
  console.log("isOpen:", isOpen, "userData:", userData);
  if (isOpen && userData) {
    setUser({
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      image: userData.image,
    });
  }
}, [isOpen, userData]);


const handleInputChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "image" && files.length > 0) {
    // If the input name is "image" and files are selected
    setUser((prevState) => ({
      ...prevState,
      [name]: files[0], // Set the image property to the selected file
    }));
  } else {
    // For other input fields, update as usual
    setUser((prevState) => ({ ...prevState, [name]: value }));
  }
};


  const updateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      if (user.full_name.trim() !== "") {
        formData.append("full_name", user.full_name);
      }

      if (user.email.trim() !== "") {
        formData.append("email", user.email);
      }
      formData.append("image", user.image);

      const response = await axios.patch(
        `http://localhost:5000/users/update/${username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowSuccessAlert(true);
        setMsg("User successfully updated!");
        Swal.fire({
          title: "Update User Success",
          text: "Your user has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload();
        });

        if (onSuccess) {
          onSuccess();
        }
        history.push("/admin/profile");
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to update user. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setShowErrorMsg(true);
      setMsg("Failed to update user. Please try again.");
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

  console.log("Current user state:", user);


  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={handleClose}
      zIndex={10}
    >
      <ModalOverlay />
      <form onSubmit={updateUser}>
        <ModalContent>
          <ModalHeader>Edit your profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {showSuccessAlert && <Alert status="success">{msg}</Alert>}
            {showErrorMsg && <Alert status="error">{msg}</Alert>}
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Full Name"
                name="full_name"
                value={user.full_name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image Profile</FormLabel>
              <Input
                placeholder="Image"
                name="image"
                type="file"
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

export default EditUser;
