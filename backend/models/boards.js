import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Room } from "./rooms.js";

export const Board = sequelize.define("Board", {
  turn: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
