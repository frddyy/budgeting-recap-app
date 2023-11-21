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

const Wallets = ({ title }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  const [walletData, setWalletData] = useState([]);
  const [username, setUsername] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);

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
          setWalletData(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

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
    }
  };

  const handleEdit = (walletName) => {
    // Logika untuk mengarahkan pengguna ke halaman atau formulir edit
    // Misalnya, Anda dapat menggunakan react-router-dom untuk ini
    // Contoh: history.push(`/edit-wallet/${walletId}`);
  };

  return (
    <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p="6px 0px 22px 0px">
        <Flex justify="space-between" align="center" minHeight="60px" w="100%">
          <Text fontSize="lg" color={textColor} fontWeight="bold">
            {title}
          </Text>
          <Button bg={bgButton} color="white" fontSize="xs" variant="no-hover">
            ADD NEW WALLET
          </Button>
        </Flex>
      </CardHeader>
      <CardBody>
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" pl="0px">
              <Th color="gray.400">No</Th>
              <Th color="gray.400">Wallet Name</Th>
              <Th color="gray.400">Balance</Th>
              <Th color="gray.400">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {walletData.map((wallet) => (
              <TableWalletRow
                key={wallet.id}
                wallet={wallet}
                onDelete={() => handleDelete(wallet.name)}
                onEdit={() => handleEdit(wallet.name)}
              />
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default Wallets;
