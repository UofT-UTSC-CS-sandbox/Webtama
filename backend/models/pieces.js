import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Board } from "./boards.js";

export const Piece = sequelize.define("Piece", {
  xpos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ypos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  side: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Piece.belongsTo(Board);
Board.hasMany(Piece);
