import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Room } from "./rooms.js";

export const Board = sequelize.define("Board", {
  turn: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  card1: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: true,
  },
  card2: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: true,
  },
});
