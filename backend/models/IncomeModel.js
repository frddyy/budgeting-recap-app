import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Wallet from "./WalletModel.js";

const Income = db.sequelize.define(
  "incomes",
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

Income.belongsTo(Wallet, {
  foreignKey: "walletId",
  onDelete: "CASCADE",
});

export default Income;
