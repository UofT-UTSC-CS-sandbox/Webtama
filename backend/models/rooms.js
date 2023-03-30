import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";
import { Board } from "./boards.js";

export const Room = sequelize.define("Room", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  Host: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Guest: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Room.hasOne(Board);
// Room.belongsToMany(User, { through: "UserRoom" });
// User.belongsToMany(Room, { through: "UserRoom" });
