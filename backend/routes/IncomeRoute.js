import express from "express";
import {
  createIncome,
  getIncomeByUser,
  getTotalIncomeInPeriod,
  getIncomesByUsernameAndPeriod,
  deleteIncomeByUsernameAndIncomeId,
  updateIncomeByUsernameAndIncomeId,
} from "../controllers/IncomeController.js";

const router = express.Router();

router.patch(
  "/incomes/:username/:income_id",
  updateIncomeByUsernameAndIncomeId
);

router.post("/incomes", createIncome);
router.get("/incomes/:username", getIncomeByUser);
router.get("/incomes-period/:username", getIncomesByUsernameAndPeriod);
router.get("/incomes/totalincomeperiode", getTotalIncomeInPeriod);
router.delete(
  "/incomes/:username/:income_id",
  deleteIncomeByUsernameAndIncomeId
);

export default router;
