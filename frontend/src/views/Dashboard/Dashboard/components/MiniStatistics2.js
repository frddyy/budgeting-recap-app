// Chakra imports
import {
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import IconBox from "components/Icons/IconBox";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Cookies from "js-cookie";

const MiniStatistics = ({
  title,
  amount,
  icon,
  onTotalBalanceChange,
  onTotalWalletChange,
  number,
}) => {
  const iconTeal = useColorModeValue("teal.300", "teal.300");
  const textColor = useColorModeValue("gray.700", "white");

  const [walletData, setWalletData] = useState([]);
  const [username, setUsername] = useState("");
  const history = useHistory();

  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  // Helper function to format balance
  const formatBalanceToRp = (balance) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(balance);
  };

  const handleSelectWallet = (event) => {
    const walletId = parseInt(event.target.value, 10); // Ubah menjadi numerik
    setSelectedWalletId(walletId);
  };

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
            `https://api-spendwise.agilearn.id/wallets/${username}`
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
  }, [username, onTotalBalanceChange]);

  useEffect(() => {
    console.log("Selected Wallet ID:", selectedWalletId);
    if (selectedWalletId) {
      const selectedWallet = walletData.find((w) => w.id === selectedWalletId);
      console.log("Selected Wallet:", selectedWallet);
      setWalletBalance(selectedWallet ? selectedWallet.balance : 0);
    } else {
      setWalletBalance(0);
    }
  }, [selectedWalletId, walletData]);

  return (
    <Card minH="83px">
      <CardBody>
        <Flex
          flexDirection="row"
          align="center"
          justify="space-between"
          w="100%"
          ml="5px"
          mr="5px"
        >
          <Stat me="auto">
            <Select
              size="sm"
              w="auto"
              maxWidth="200px"
              height="29px"
              borderRadius="13px"
              placeholder="Select wallet"
              mr="15px"
              onChange={handleSelectWallet}
            >
              {walletData.map((wallet) => (
                <option value={wallet.id} key={wallet.id}>
                  {wallet.name}
                </option>
              ))}
            </Select>
            <Flex>
              <StatNumber ml="4px" fontSize="lg" color={textColor}>
                {formatBalanceToRp(walletBalance)}
              </StatNumber>
            </Flex>
          </Stat>
          <IconBox as="box" h={"45px"} w={"45px"} ml="10px" bg={iconTeal}>
            {icon}
          </IconBox>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default MiniStatistics;
