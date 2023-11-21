import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Budget from "./BudgetModel.js";
import Wallet from "./WalletModel.js";

const Expense = db.sequelize.define(
  "expenses",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Expense.belongsTo(Budget, {
  foreignKey: "budgetId",
  onDelete: "CASCADE",
});
Expense.belongsTo(Wallet, {
  foreignKey: "walletId",
  onDelete: "CASCADE",
});

export default Expense;
