import express from "express";
// import dotenv from 'dotenv';
// import db from './config/Database.js';
import cors from "cors";

import UserRoute from "./routes/UserRoute.js";
import WalletRoute from "./routes/WalletRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import IncomeRoute from "./routes/IncomeRoute.js";
import BudgetRoute from "./routes/BudgetRoute.js";
import ExpenseRoute from "./routes/ExpenseRoute.js";

// dotenv.config();
const port = 7171;
const app = express();

// app.use(cors({ credentials: true, origin: 'http://194.233.93.124:7171' }));
app.use(cors());
app.use(express.json());

app.use(UserRoute);
app.use(WalletRoute);
app.use(CategoryRoute);
app.use(IncomeRoute);
app.use(BudgetRoute);
app.use(ExpenseRoute);
app.use(express.static("public"));

// (async () => {
//   await db.sequelize.sync();
// })();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.listen(7171, () => console.log('Server Running Up ....'));
