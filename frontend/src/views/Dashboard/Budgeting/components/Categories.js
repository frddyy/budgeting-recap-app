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
import TableCategoryRow from "components/Tables/TableCategoryRow";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Cookies from "js-cookie";
import AddCategory from "components/AddData/AddCategory";
import Swal from "sweetalert2";

const Categories = ({ title }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  const [categoryData, setCategoryData] = useState([]);
  const [username, setUsername] = useState("");

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

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
            `http://194.233.93.124:7171/categories/${username}`
          );
          const categories = response.data.data || [];
          setCategoryData(categories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]); // Pastikan untuk menyertakan username dalam dependency array jika username digunakan dalam fetchData

  const handleAddButton = () => {
    console.log("Add button clicked");
    setIsAddCategoryModalOpen(true);
  };

  const handleDelete = (categoryName) => {
    // Tampilkan dialog konfirmasi dengan SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika pengguna mengklik 'Yes'
        deleteCategory(categoryName);
      }
    });
  };

  const deleteCategory = async (categoryName) => {
    try {
      const response = await axios.delete(
        `http://194.233.93.124:7171/categories/${username}/${categoryName}`
      );

      if (response.status === 200) {
        const updatedCategoryData = categoryData.filter(
          (category) => category.name !== categoryName
        );
        setCategoryData(updatedCategoryData);
        Swal.fire("Deleted!", "Your category has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire("Error", "Failed to delete the category.", "error");
    }
  };

  // Fungsi baru untuk menangani navigasi
  const handleShow = (categoryName) => {
    history.push(`/admin/budgets/${categoryName}`);
  };

  return (
    <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }}>
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
              ADD NEW CATEGORY
            </Button>
          </Flex>
        </CardHeader>
      </SimpleGrid>
      <CardBody>
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" pl="0px">
              <Th color="gray.400">No</Th>
              <Th color="gray.400">Category</Th>
              <Th color="gray.400">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categoryData.map((category, index) => (
              <TableCategoryRow
                key={category.id}
                index={index + 1}
                category={category}
                onDelete={() => handleDelete(category.name)}
                onShow={handleShow} // Mengirimkan fungsi handleShow
              />
            ))}
          </Tbody>
        </Table>
      </CardBody>

      <AddCategory
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSuccess={() => {
          // Perform any actions needed on successful addition
          setIsAddCategoryModalOpen(false);
        }}
      />
    </Card>
  );
};

export default Categories;
