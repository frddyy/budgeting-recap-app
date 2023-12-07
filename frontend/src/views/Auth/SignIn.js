import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/BgLogin.jpg";

function SignIn() {
  const history = useHistory(); // Use useHistory

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [error, setError] = useState(null);

  const handleSignup = () => {
    // Redirect to the signup page
    history.push("/auth/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://api-spendwise.agilearn.id/login`,
        formData,
        { validateStatus: false }
      ); // Replace with your API endpoint
      if (response.status === 200) {
        // setDefaultPageAttributes();
        Cookies.set("username", response.data.username, { expires: 1 }); // Save username to cookie with expiry of 1 day
        history.push("/admin/dashboard"); // Navigate to home page
      } else if (response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Login Failed!",
          text: response.data.error,
        });
      } else if (response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Login Failed!",
          text: response.data.error,
        });
      }
      // You can perform actions like redirecting the user after successful login
    } catch (err) {
      setError("Login failed. Please check your credentials."); // Handle errors
      console.error("Login failed:", err);
    }
  };

  // Chakra color mode
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");
  return (
    <Flex position="relative" mb="40px">
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: "150px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="32px" mb="10px">
              Welcome Back
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColor}
              fontWeight="bold"
              fontSize="14px"
            >
              Enter your username and password to sign in
            </Text>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel mr4s="4px" fontSize="sm" fontWeight="normal">
                  Username
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  type="text"
                  placeholder="Your username"
                  size="lg"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Password
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="36px"
                  fontSize="sm"
                  type="password"
                  placeholder="Your password"
                  size="lg"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <FormControl display="flex" alignItems="center">
                  <Switch id="remember-login" colorScheme="teal" me="10px" />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    ms="1"
                    fontWeight="normal"
                  >
                    Remember me
                  </FormLabel>
                </FormControl>
                <Button
                  fontSize="10px"
                  type="submit"
                  bg="teal.300"
                  w="100%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{
                    bg: "teal.200",
                  }}
                  _active={{
                    bg: "teal.400",
                  }}
                >
                  SIGN IN
                </Button>
              </FormControl>
            </form>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px"
            >
              <Text color={textColor} fontWeight="medium">
                Don't have an account?
                <Link
                  color={titleColor}
                  as="span"
                  ms="5px"
                  fontWeight="bold"
                  onClick={handleSignup}
                >
                  Sign Up
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100%"
          w="40vw"
          position="absolute"
          right="0px"
        >
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius="20px"
          ></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
