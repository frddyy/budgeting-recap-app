import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";
import Income from "./IncomeModel.js";
import Expense from "./ExpenseModel.js";

const Wallet = db.sequelize.define(
  "wallets",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Wallet.hasMany(Income, {
  foreignKey: "walletId",
  onDelete: "CASCADE",
});
Wallet.hasMany(Expense, {
  foreignKey: "walletId",
  onDelete: "CASCADE",
});

Wallet.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

export default Wallet;
