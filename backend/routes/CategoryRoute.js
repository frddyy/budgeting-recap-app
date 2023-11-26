import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryByUsername,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();

// Create a new category
router.post("/categories", createCategory);

// Get all categories
router.get("/categories", getAllCategories);

// Get a category by username
router.get("/categories/:username", getCategoryByUsername);

// Update a category by username
router.patch("/categories/:username/:categoryName", updateCategory);

// Delete a category by username
router.delete("/categories/:username/:categoryName", deleteCategory);

export default router;
