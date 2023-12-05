// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

const Header = ({
  backgroundHeader,
  backgroundProfile,
  avatarImage,
  name,
  email,
  tabs,
  username,
  edituser,
  deleteuser,
}) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const borderProfileColor = useColorModeValue(
    "white",
    "rgba(255, 255, 255, 0.31)"
  );
  const emailColor = useColorModeValue("gray.400", "gray.300");
  console.log("Avatar Image:", avatarImage);
  console.log("edit:", edituser);
  console.log("delete:", deleteuser);
  return (
    <Box
      mb={{ sm: "190px", md: "70px", xl: "70px" }}
      borderRadius="15px"
      px="0px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      align="center"
    >
      <Box
        bgImage={backgroundHeader}
        w="100%"
        h={{ sm: "230px", md: "200px", lg: "270px" }} // Adjusted height
        borderRadius="25px"
        bgPosition="50%"
        bgRepeat="no-repeat"
        position="relative"
        display="flex"
        justifyContent="center"
      >
        <Flex
          direction={{ sm: "column", md: "row" }}
          mx="1.5rem"
          maxH="280px"
          w={{ sm: "75%", xl: "95%" }}
          justifyContent={{ sm: "center", md: "space-between" }}
          align="center"
          backdropFilter="saturate(200%) blur(50px)"
          position="absolute"
          boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
          border="2px solid"
          borderColor={borderProfileColor}
          bg={backgroundProfile}
          p="18px" // Reduced padding
          borderRadius="20px"
          transform={{
            sm: "translateY(57%)", // Adjusted transform
            md: "translateY(100%)",
            lg: "translateY(140%)",
          }}
        >
          <Flex
            align="center"
            mb={{ sm: "0px", md: "0px" }}
            direction={{ sm: "column", md: "row" }}
            w={{ sm: "100%" }}
            textAlign={{ sm: "center", md: "start" }}
          >
            <Avatar
              me={{ md: "22px" }}
              src={avatarImage}
              w="80px"
              h="80px"
              borderRadius="15px"
            />
            <Flex direction="column" maxWidth="100%" my={{ sm: "14px" }}>
              <Text
                fontSize={{ sm: "lg", lg: "xl" }}
                color={textColor}
                fontWeight="bold"
                ms={{ sm: "8px", md: "0px" }}
              >
                {name}
              </Text>
              <Text
                fontSize={{ sm: "sm", md: "md" }}
                color={emailColor}
                fontWeight="semibold"
              >
                {username}
              </Text>
              <Text
                fontSize={{ sm: "sm", md: "md" }}
                color={emailColor}
                fontWeight="semibold"
              >
                {email}
              </Text>
            </Flex>
          </Flex>
          <Flex
            direction={{ sm: "column", lg: "row" }}
            w={{ sm: "100%", md: "50%", lg: "auto" }}
          >
            <Button
              p="0px"
              bg="transparent"
              onClick={edituser}
              _hover={{
                bg: "desiredBackgroundColor",
                color: "desiredTextColor",
              }}
            >
              <Flex
                align="center"
                w={{ lg: "135px" }}
                borderRadius="15px"
                justifyContent="center"
                py="10px"
                cursor="pointer"
              >
                {tabs[0].icon}
                <Text
                  fontSize="xs"
                  color={textColor}
                  fontWeight="bold"
                  ms="6px"
                >
                  {tabs[0].name}
                </Text>
              </Flex>
            </Button>
            <Button
              p="0px"
              bg="transparent"
              onClick={deleteuser}
              _hover={{
                bg: "desiredBackgroundColor",
                color: "desiredTextColor",
              }}
            >
              <Flex
                align="center"
                w={{ lg: "135px" }}
                borderRadius="15px"
                justifyContent="center"
                py="10px"
                cursor="pointer"
              >
                {tabs[1].icon}
                <Text
                  fontSize="xs"
                  color={textColor}
                  fontWeight="bold"
                  ms="6px"
                >
                  {tabs[1].name}
                </Text>
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;
