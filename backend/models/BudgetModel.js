import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Expense from "./ExpenseModel.js";
import Category from "./CategoryModel.js";

const Budget = db.sequelize.define(
  "categories",
  {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount_now: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Budget.hasMany(Expense, {
  foreignKey: "budgetId",
  onDelete: "CASCADE",
});

Budget.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

export default Budget;
