import express from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseByUsername,
  updateExpenseByUsernameAndExpenseId, 
  deleteExpenseByUsernameAndExpenseId
} from "../controllers/ExpenseController.js";

const router = express.Router();

router.post('/expenses', createExpense);

router.get('/expenses', getAllExpenses);

router.get('/expenses/:username', getExpenseByUsername); 

router.patch('/expenses/:username/:expense_id', updateExpenseByUsernameAndExpenseId);

router.delete('/expenses/:username/:expense_id', deleteExpenseByUsernameAndExpenseId);

export default router;
