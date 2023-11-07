import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";
import Budget from "./BudgetModel.js";

const Category = db.sequelize.define(
  "categories",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Category.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Category.hasMany(Budget, {
  foreignKey: "budgetId",
  onDelete: "CASCADE",
});

export default Category;
