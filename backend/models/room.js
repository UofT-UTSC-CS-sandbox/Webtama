import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

export const Room = sequelize.define("Room", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

});

Room.belongsToMany(User, { through: "UserRoom" });
User.belongsToMany(Room, { through: "UserRoom" });

