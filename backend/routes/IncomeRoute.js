import express from "express";
import {
  createIncome,
  getIncomeByUser,
  getTotalIncomeInPeriod,
  getIncomesByUsernameAndPeriod,
  deleteIncomeByUsernameAndIncomeId,
} from "../controllers/IncomeController.js";

const router = express.Router();

router.post("/incomes", createIncome);
router.get("/incomes/:username", getIncomeByUser);
router.get("/incomes-period/:username", getIncomesByUsernameAndPeriod);
router.get("/incomes/totalincomeperiode", getTotalIncomeInPeriod);
router.delete(
  "/incomes/:username/:income_id",
  deleteIncomeByUsernameAndIncomeId
);


export default router;
