// Chakra imports
import {
  Button,
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  SimpleGrid,
  Grid,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TableWalletRow from "components/Tables/TableWalletRow";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Cookies from "js-cookie";
import AddWallet from "components/AddData/AddWallet";
import EditWallet from "components/EditData/EditWallet";
import Swal from "sweetalert2";

const Wallets = ({ title, onTotalBalanceChange }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  const [walletData, setWalletData] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
  const [isEditWalletModalOpen, setIsEditWalletModalOpen] = useState(false);
  const [currentEditWallet, setCurrentEditWallet] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await axios.get(
            `http://localhost:5000/wallets/${username}`
          );
          const wallets = response.data.data || [];
          setWalletData(wallets);

          const totalBalance = wallets.reduce(
            (acc, wallet) => acc + wallet.balance,
            0
          );
          onTotalBalanceChange(totalBalance); // Mengirim totalBalance ke komponen induk
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username, onTotalBalanceChange]); // Pastikan untuk menyertakan username dalam dependency array jika username digunakan dalam fetchData

  const handleAddButton = () => {
    console.log("Add button clicked");
    setIsAddWalletModalOpen(true);
  };

  const handleDelete = async (walletName) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/wallets/${username}/${walletName}`
      );
      const updatedWalletData = walletData.filter(
        (wallet) => wallet.name !== walletName
      );
      setWalletData(updatedWalletData);
    } catch (error) {
      console.error("Error deleting wallet:", error);
      console.error("Detailed error response:", error.response); // Log the detailed error response
    } finally {
      setLoading(false);
      setShowSuccessAlert(true); // Show the SweetAlert notification after the server request is complete
      Swal.fire({
        title: "Delete Wallet Success",
        text: "Delete wallet has been successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // Reload the page after user clicks "OK"
      });
    }
  };

  const handleEdit = (walletName) => {
    const selectedWallet = walletData.find(
      (wallet) => wallet.name === walletName
    );
    if (selectedWallet) {
      setCurrentEditWallet(selectedWallet); // Asumsikan Anda menambahkan state baru untuk ini
      setIsEditWalletModalOpen(true);
    }
  };

  return (
    <Card my="20px" overflowX={{ sm: "scroll", xl: "hidden" }}>
      <SimpleGrid columns={{ sm: 1, md: 1, xl: 1 }} spacing="24px">
        <CardHeader p="6px 30px 30px 22px">
          <Flex
            justify="space-between"
            align="center"
            minHeight="60px"
            w="100%"
          >
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              {title}
            </Text>
            <Button
              bg={bgButton}
              color="white"
              fontSize="xs"
              variant="no-hover"
              onClick={handleAddButton}
            >
              ADD NEW WALLET
            </Button>
          </Flex>
        </CardHeader>
      </SimpleGrid>
      <CardBody>
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" pl="0px">
              <Th color="gray.400" textAlign="center">
                No
              </Th>
              <Th color="gray.400">Wallet Name</Th>
              <Th color="gray.400">Balance</Th>
              <Th color="gray.400" textAlign="center">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {walletData.map((wallet, index) => (
              <TableWalletRow
                key={wallet.id}
                index={index + 1}
                wallet={wallet}
                onDelete={() => handleDelete(wallet.name)}
                onEdit={() => handleEdit(wallet.name)}
              />
            ))}
          </Tbody>
        </Table>
      </CardBody>

      <EditWallet
        isOpen={isEditWalletModalOpen}
        onClose={() => setIsEditWalletModalOpen(false)}
        onSuccess={() => {
          // Perform any actions needed on successful addition
          setIsEditWalletModalOpen(false);
        }}
        walletData={currentEditWallet}
      />

      <AddWallet
        isOpen={isAddWalletModalOpen}
        onClose={() => setIsAddWalletModalOpen(false)}
        onSuccess={() => {
          // Perform any actions needed on successful addition
          setIsAddWalletModalOpen(false);
        }}
      />
    </Card>
  );
};

export default Wallets;
