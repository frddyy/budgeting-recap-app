import express from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();

// Create a new category
router.post("/categories", createCategory);

// Get all categories
router.get("/categories", getAllCategories);

// Update a category by username and title
router.put("/categories/:username/:title", updateCategory);

// Delete a category by username and title
router.delete("/categories/:username/:title", deleteCategory);

export default router;
