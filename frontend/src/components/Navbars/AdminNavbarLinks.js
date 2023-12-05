import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  Spacer,
  Image,
} from "@chakra-ui/react";
import { ProfileIcon, SettingsIcon } from "components/Icons/Icons";
import { FaSignOutAlt } from "react-icons/fa";
import SidebarResponsive from "components/Sidebar/SidebarResponsive";
import routes from "routes.js";

export default function HeaderLinks(props) {
  const { variant, children, fixed, secondary, onOpen, ...rest } = props; 

  const history = useHistory();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  const profile = () => {
    history.push("/admin/profile");
  };

  const signOut = () => {
    Cookies.remove("username");
    history.push("/auth/signin");
  };

  let navbarIcon = useColorModeValue("gray.500", "gray.200");

  if (props.secondary) {
    navbarIcon = "white";
  }

    useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchUsers(storedUsername); // Fetch expenses after setting username
    }
  }, []);

const fetchUsers = async (username) => {
  try {
    const response = await axios.get(`http://localhost:5000/users/${username}`);
    console.log("Full response:", response);
    console.log("User data:", response.data);
    setUser(response.data.data); // Update this line
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const userImageUrl = user && user.image ? `http://localhost:5000/user/image/${user.image}` : null;  
console.log("User Image URL:", userImageUrl);

const renderProfileIcon = () => {
  if (userImageUrl) {
    return <Image src={userImageUrl} borderRadius="full" boxSize="35px" alt="User profile" />;
  } else {
    return <ProfileIcon color={navbarIcon} w="35px" h="35px" />;
  }
};

  return (
    <Flex
      pe={{ sm: "0px", md: "0px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
    >
      <Spacer />
      <SidebarResponsive
        logoText={props.logoText}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />
      {/* <SettingsIcon
        cursor="pointer"
        ms={{ base: "16px", xl: "0px" }}
        me="16px"
        onClick={props.onOpen}
        color={navbarIcon}
        w="25px"
        h="25px"
      /> */}
      <Menu>
        <MenuButton
          as={IconButton}
          ms="20px"
          px="0px"
          me={{ sm: "2px", md: "0px" }}
          color={navbarIcon}
          variant="transparent-with-icon"
          aria-label="Options"
          icon={renderProfileIcon()}
        />
        <MenuList>
          <MenuItem icon={renderProfileIcon()} onClick={profile}>
            {user ? (user.full_name ? user.full_name : 'Profile') : 'Loading...'}
          </MenuItem>

          <MenuItem icon={<FaSignOutAlt />} onClick={signOut}>
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};