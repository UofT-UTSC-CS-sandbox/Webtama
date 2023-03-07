import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Room } from "./room.js";

export const Board = sequelize.define("Board", {
  coordinate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    },
    
});

Board.belongsTo(Room);