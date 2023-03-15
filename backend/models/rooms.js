import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

export const Room = sequelize.define("Room", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Host: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Guest: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

Room.belongsToMany(User, { through: "UserRoom" });
User.belongsToMany(Room, { through: "UserRoom" });

