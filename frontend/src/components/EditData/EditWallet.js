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

const EditWallet = ({ isOpen, onClose, onSuccess, walletData }) => {
  const [wallet, setWallet] = useState({ name: "", balance: "" });
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

  // Gunakan walletData untuk mengatur state
  useEffect(() => {
    if (isOpen && walletData) {
      setWallet({
        name: walletData.name,
        balance: walletData.balance,
      });
    }
  }, [isOpen, walletData]);

  const fetchWalletData = async (walletName) => {
    if (!username) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/wallets/${username}/${walletName}`
      );
      if (response.status === 200) {
        // Setelah mendapatkan data dari API, update state 'wallet'
        setWallet({
          name: response.data.name, // Asumsi 'name' adalah properti dari data yang diterima
          balance: response.data.balance, // Asumsi 'balance' adalah properti dari data yang diterima
        });
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWallet((prevState) => ({ ...prevState, [name]: value }));
  };

  const updateWallet = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.patch(
        `http://localhost:5000/wallets/${username}/${wallet.name}`, // Gunakan wallet.name
        wallet
      );

      if (response.status === 200) {
        setShowSuccessAlert(true);
        setMsg("Wallet successfully updated!");
        Swal.fire({
          title: "Update Wallet Success",
          text: "Your wallet has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload(); // Reload the page after user clicks "OK"
        });

        if (onSuccess) {
          onSuccess();
        }
        history.push("/admin/wallets");
      } else {
        setShowErrorMsg(true);
        setMsg("Failed to update wallet. Please try again.");
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      setShowErrorMsg(true);
      setMsg("Failed to update wallet. Please try again.");
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
      <form onSubmit={updateWallet}>
        <ModalContent
          style={{
            borderRadius: "20px", // Adjust the border-radius to your preference
          }}
        >
          <ModalHeader>Edit your wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {showSuccessAlert && <Alert status="success">{msg}</Alert>}
            {showErrorMsg && <Alert status="error">{msg}</Alert>}
            <FormControl>
              <FormLabel>Wallet Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Wallet Name"
                name="name"
                value={wallet.name}
                onChange={handleInputChange}
                readOnly
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Balance</FormLabel>
              <Input
                placeholder="Balance"
                name="balance"
                value={wallet.balance}
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

export default EditWallet;
