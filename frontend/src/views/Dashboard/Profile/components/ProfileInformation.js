// Chakra imports
import { Flex, Icon, Link, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const ProfileInformation = ({ title, name, username, email }) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card p="16px" my={{ sm: "24px", xl: "16px" }}>
      <CardHeader p="12px 5px" mb="12px">
        <Text fontSize="lg" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody px="5px">
        <Flex direction="column">
          <Flex align="center" mb="18px">
            <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
              Full Name:{" "}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {name}
            </Text>
          </Flex>
          <Flex align="center" mb="18px">
            <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
              Username:{" "}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {username}
            </Text>
          </Flex>
          <Flex align="center" mb="18px">
            <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
              Email:{" "}
            </Text>
            <Text fontSize="md" color="gray.500" fontWeight="400">
              {email}
            </Text>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ProfileInformation;
