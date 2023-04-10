import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Room } from "./rooms.js";

export const Board = sequelize.define("Board", {
  turn: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  card1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  card2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
