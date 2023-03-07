import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Board = sequelize.define("Board", {
  coordinate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
});
