import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new category
export const createCategory = async (req, res) => {
  const newCategoryData = req.body;

  if (!newCategoryData.name) {
    return res.status(400).json({ error: 'Name is required for a category' });
  }

  try {
     // Find the user by user_id
     const user = await prisma.user.findUnique({
      where: { id: newCategoryData.user_id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: newCategoryData.name,
        user_id: user.id,
      },
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with the same name already exists' });
    }

    const category = await prisma.category.create({
      data: {
        name: newCategoryData.name,
        description: newCategoryData.description,
        user: { connect: {id: newCategoryData.user_id}},
      },
    });

    res.status(201).json({ msg: 'Category created successfully', category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategoryByUsername = async (req, res) => {
  try {
    const response = await prisma.category.findMany({
      where: {
        user: { username: req.params.username },
      },
    });
    if (!response || response.length === 0) {
      res.status(404).json({ msg: "Category not found" });
    } else {
      res.status(200).json({ msg: "Category found", data: response });
    }
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  const { username, name } = req.params; // Assuming you provide the category ID in the URL
  const updatedCategoryData = req.body;

  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the category by user ID and category name
    const category = await prisma.category.findFirst({
      where: {
        user_id: user.id,
        name: name,
      },
    });

     if (!category) {
       return res.status(404).json({ error: "Category not found" });
     }

     const updatedCategory = await prisma.category.update({
       where: {
         id: category.id,
         name: name,
       },
       data: updatedCategoryData,
     });

    res.status(200).json({ msg: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  const { username, categoryName } = req.params; // Assuming you provide the category ID in the URL

  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the category by user ID and category name
    const category = await prisma.category.findFirst({
      where: {
        user_id: user.id,
        name: categoryName,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Delete the wallet
    await prisma.category.delete({
      where: {
        id: category.id,
        name: categoryName,
      },
    });

    res.status(200).json({
      msg: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};







