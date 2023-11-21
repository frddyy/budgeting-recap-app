// Import necessary modules
import express from "express";
import {
  createWallet,
  getWalletByUsername,
  updateWallet,
  deleteWallet
} from "../controllers/WalletController.js";

// Create an Express Router
const router = express.Router();

router.post("/wallets", createWallet);
router.get("/wallets/:username", getWalletByUsername);
router.patch("/wallets/:username/:wallet_name", updateWallet);
router.delete("/wallets/:username/:wallet_name", deleteWallet);


export default router;
