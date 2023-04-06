import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  mmr: {
    type: DataTypes.INTEGER,
    defaultValue: 200,
  },
  premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  activeRoom: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
});
