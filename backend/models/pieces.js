import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Board } from "./boards.js";

export const Piece = sequelize.define("Piece", {
  coordinate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    },
  side: {
    type: DataTypes.STRING,
    allowNull: false,
    },
});

Piece.belongsTo(Board);
Board.hasMany(Piece);
