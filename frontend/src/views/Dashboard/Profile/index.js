// Chakra imports
import { Flex, Grid, useColorModeValue, Text, Image, Button } from "@chakra-ui/react";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import EditUser from "components/EditData/EditUser";
import { useHistory } from "react-router-dom";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Header from "./components/Header";
import ProfileInformation from "./components/ProfileInformation";
import { ProfileIcon } from "components/Icons/Icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

function Profile() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  const history = useHistory();
  const [userData, setUser] = useState();
  const [username, setUsername] = useState("");
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchUsers(storedUsername); // Fetch after setting username
    }
  }, []);

  const fetchUsers = async (username) => {
    try {
      const response = await axios.get(`https://api-spendwise.agilearn.id/users/${username}`);
      console.log("Full response:", response);
      console.log("User data:", response.data);
      setUser(response.data.data); // Update this line
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteUser = async () => {
    try {
      if (userData && userData.username) {
        const response = await axios.delete(
          `https://api-spendwise.agilearn.id/users/${userData.username}`
        );
        Cookies.remove("username");
        history.push("/auth/signin");
      } else {
        console.error("Username not found in userData.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      console.error("Detailed error response:", error.response);
    }
  };

  const handleEdit = () => {
    setIsEditUserModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const userImageUrl = userData && userData.image ? `https://api-spendwise.agilearn.id/user/image/${userData.image}` : null;

  const renderProfileIcon = () => {
    if (userImageUrl) {
      return <Image src={userImageUrl} alt="User profile" />;
    } else {
      return <ProfileIcon w="35px" h="35px" />;
    }
  };

  return (
    <Flex direction="column">
      <Header
        backgroundHeader={ProfileBgImage}
        backgroundProfile={bgProfile}
        avatarImage={userImageUrl}
        edituser={handleEdit}
        deleteuser={handleDelete}
        name={userData ? (userData.full_name ? userData.full_name : "Nama Lengkap Belum Diisi") : "Loading..."}
        username={userData ? (userData.username ? userData.username : "Username Belum Diisi") : "Loading..."}
        email={userData ? (userData.email ? userData.email : "Email Belum Diisi") : "Loading..."}
        tabs={[
          {
            name: <Text color="blue.500" onClick={handleEdit}>EDIT</Text>,
            icon: <FaPencilAlt w="100%" h="100%" color="blue" onClick={handleEdit} />,
          },
          {
            name: <Text color="red.500" onClick={handleDelete}>DELETE ACCOUNT</Text>,
            icon: <FaTrashAlt w="100%" h="100%" color="red" onClick={handleDelete} />,
          },
        ]}
      />
      <Grid templateColumns={{ sm: "1fr", xl: "repeat( 1 , 1fr)" }} gap="22px">
        <ProfileInformation
          title={"Profile Information"}
          name={userData ? (userData.full_name ? userData.full_name : "Nama Lengkap Belum Diisi") : "Loading..."}
          username={userData ? (userData.username ? userData.username : "Username Belum Diisi") : "Loading..."}
          email={userData ? (userData.email ? userData.email : "Email Belum Diisi") : "Loading..."}
        />
      </Grid>
      <EditUser
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        onSuccess={() => {
          // Perform any actions needed on successful addition
          setIsEditUserModalOpen(false);
        }}
        userData={userData} // Move this line outside of the onSuccess function
      />
      <ConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={deleteUser}
      />
    </Flex>
  );
}

function ConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete your account?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onConfirm}>
            Confirm
          </Button>
          <Button colorScheme="blue" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Profile;
