import express from "express";
import {
  createBudget,
  getAllBudgets, 
  getBudgetByUsername,
  getBudgetByUsernameAndCategory,
  updateBudgetByUsernameAndBudgetId,
  deleteBudgetByUsernameAndBudgetId,
} from "../controllers/BudgetController.js";

const router = express.Router();

router.post('/budgets', createBudget);

router.get('/budgets', getAllBudgets); 

router.get('/budgets/:username', getBudgetByUsername);

router.get('/budgets/:username/:category', getBudgetByUsernameAndCategory);

router.patch('/budgets/:username/:budget_id', updateBudgetByUsernameAndBudgetId);

router.delete('/budgets/:username/:budget_id', deleteBudgetByUsernameAndBudgetId);


export default router;
