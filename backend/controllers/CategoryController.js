import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new category
export const createCategory = async (req, res) => {
  const newCategoryData = req.body;

  if (!newCategoryData.title) {
    return res.status(400).json({ error: 'Title is required for a category' });
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
        title: newCategoryData.title,
        user_id: user.id,
      },
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with the same title already exists' });
    }

    const category = await prisma.category.create({
      data: {
        title: newCategoryData.title,
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

// Update a category
export const updateCategory = async (req, res) => {
  const categoryId = parseInt(req.params.id); // Assuming you provide the category ID in the URL
  const updatedCategoryData = req.body;

  if (!updatedCategoryData.title) {
    return res.status(400).json({ error: 'Title is required for a category' });
  }

  try {
    const existingCategory = await prisma.category.findUnique({
      where: {
        title: updatedCategoryData.title,
      },
    });

    if (existingCategory && existingCategory.id !== categoryId) {
      return res.status(400).json({ error: 'Category with the same title already exists' });
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: updatedCategoryData,
    });

    res.status(200).json({ msg: 'Category updated successfully', category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  const categoryId = parseInt(req.params.id); // Assuming you provide the category ID in the URL

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    res.status(204).json({ msg: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


