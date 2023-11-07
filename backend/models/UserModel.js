import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Wallet from "./WalletModel.js";
import Category from "./CategoryModel.js";

const User = db.sequelize.define(
  "Users",
  {
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

User.hasMany(Category, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

User.hasMany(Wallet, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

export default User;

(async () => {
  await db.sequelize.sync();
})();