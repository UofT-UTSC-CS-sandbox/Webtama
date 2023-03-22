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
<<<<<<< HEAD
=======
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mmr: {
    type: DataTypes.INTEGER,
    defaultValue: 200,
  },
  
>>>>>>> a4ad929f1d9fbae4b4d385703a985115621ace13
});
