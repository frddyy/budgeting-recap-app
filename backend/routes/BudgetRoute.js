import express from "express";
import {
  createBudget,
  getAllBudgets, 
  getBudgetByUsername,
  updateBudgetByUsernameAndBudgetId,
  deleteBudgetByUsernameAndBudgetId,
} from "../controllers/BudgetController.js";

const router = express.Router();

router.post('/budgets', createBudget);

router.get('/budgets', getAllBudgets); 

router.get('/budgets/:username', getBudgetByUsername);

router.patch('/budgets/:username/:budget_id', updateBudgetByUsernameAndBudgetId);

router.delete('/budgets/:username/:budget_id', deleteBudgetByUsernameAndBudgetId);


export default router;
