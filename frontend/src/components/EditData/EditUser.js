import React, { useRef, useState, useEffect, useCallback } from "react";
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
  Box,
  Icon,
  Text,
  Image,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import { MdUpload } from "react-icons/md";

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
  const [imagePreview, setImagePreview] = useState(null);

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

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    setUser((prevState) => ({
      ...prevState,
      image: file,
    }));

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/jpg",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const updateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("full_name", user.full_name || "");
      formData.append("email", user.email || "");
      if (user.image) {
        formData.append("image", user.image);
      }

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

  // Image preview section with modifications
  const imagePreviewSection = (
    <Box mt={4} textAlign="center">
      <Text fontSize="lg" fontWeight="bold">
        Image Preview
      </Text>
      <Box
        border="1px solid gray"
        borderRadius="md"
        overflow="hidden"
        display="inline-block" // To center the box
      >
        <Image
          src={imagePreview}
          maxW="330px"
          maxH="330px"
          display="block" // Ensures image takes the full width of the box
          mx="auto" // Centers image horizontally
        />
      </Box>
    </Box>
  );

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={handleClose}
      zIndex={10}
    >
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <form onSubmit={updateUser}>
        <ModalContent
          style={{
            borderRadius: "20px", // Adjust the border-radius to your preference
          }}
        >
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
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Box p={5} border="2px dashed gray" textAlign="center">
                  <Icon as={MdUpload} w="24px" h="24px" />
                  <Text>
                    Drag 'n' drop some files here, or click to select files
                  </Text>
                </Box>
                {imagePreview && imagePreviewSection}
              </div>
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
