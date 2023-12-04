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
import Swal from 'sweetalert2'; // Import SweetAlert
import { useHistory } from 'react-router-dom'; // Import useHistory

const AddWallet = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [wallet, setWallet] = useState({ name: "", balance: "" });
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const [isLoading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [msg, setMsg] = useState("");

  const history = useHistory(); // Inisialisasi useHistory

  const [walletCreated, setWalletCreated] = useState(false); // New state to track wallet creation

  // New useEffect to show SweetAlert notification
  useEffect(() => {
    if (walletCreated) {
      Swal(
        "Create Wallet Success",
        "Your wallet has been created successfully!",
        "success"
      );
      setWalletCreated(false); // Reset the state
    }
  }, [walletCreated]);

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
            `http://localhost:5000/users/${username}`
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
    setWallet((prevState) => ({ ...prevState, [name]: value }));
  };

  const saveWallet = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const walletData = {
        ...wallet,
        user_id: userId,
      };

      const response = await axios.post(
        "http://localhost:5000/wallets",
        walletData
      );

      if (response.status === 200) {
        if (onSuccess) {
          onSuccess();
        }
        history.push("/admin/wallets");
        setShowSuccessAlert(true);
        setMsg("Wallet successfully created!");
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to create wallet. Please try again.");
      }
    } catch (error) {
      console.error("Error saving wallet:", error);
      setShowErrorMsg(true);
      setMsg("Failed to create wallet. Please try again.");
    } finally {
      setLoading(false);
      handleClose();
      setShowSuccessAlert(true); // Show the SweetAlert notification after the server request is complete
      Swal.fire({
        title: "Create Wallet Success",
        text: "Your wallet has been created successfully!",
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
          <form onSubmit={saveWallet}>
        <ModalContent
          style={{
            borderRadius: "20px", // Adjust the border-radius to your preference
          }}
        >
          <ModalHeader>Create your wallet</ModalHeader>
          <ModalCloseButton onClick={handleClose} />
          <ModalBody pb={6}>
            {showSuccessAlert && <Alert severity="success">{msg}</Alert>}
            {showErrorMsg && <Alert severity="error">{msg}</Alert>}
              <FormControl>
                <FormLabel>Wallet Name</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Wallet Name"
                  name="name"
                  value={wallet.name}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "13px", // Adjust the border-radius to your preference
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Balance</FormLabel>
                <Input
                  placeholder="Balance"
                  name="balance"
                  value={wallet.balance}
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
};;;

export default AddWallet;
