// Import necessary modules
import express from "express";
import {
  createUser,
  getAllUsers,
  getUserByUsername,
  deleteUserByUsername,
  updatePasswordByUsername,
  login,
} from "../controllers/UserController.js";

// Create an Express Router
const router = express.Router();

router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/users/:username", getUserByUsername);
router.delete("/users/:username", deleteUserByUsername);
router.patch("/users/:username", updatePasswordByUsername);
router.post("/login", login);

export default router;
