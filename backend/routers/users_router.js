import { User } from "../models/users.js";
import { Router } from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import { isAuthenticated } from "../middleware/helpers.js";
import { userInfo } from "../middleware/helpers.js";

export const usersRouter = Router();
const upload = multer({ dest: "uploads/" });

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const msg = {
//   to: "jasoncndai@gmail.com",
//   from: "keia.r.ahmati@gmail.com",
//   subject: "user login",
//   text: "user yokiayo logged in!",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };

// sgMail.send(msg).then(() => {});

//Get all users
usersRouter.get("/", async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

//Get user by id
usersRouter.get("/found/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  return res.json({ user });
});

usersRouter.get("/signout", function (req, res, next) {
  req.session.destroy();
  return res.json({ message: "Signed out." });
});

usersRouter.patch("/:id/ratings", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const { rating } = req.body;
  user.rating += rating;
  user.save();
  user.reload();
  return res.json(user);
});

usersRouter.get("/:id/rooms", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const activeRoom = user.activeRoom;

  if (!activeRoom) {
    return res.status(404).json({ error: "User has no active room." });
  }

  return res.json(activeRoom);
});

usersRouter.get("/me", isAuthenticated, userInfo, async (req, res) => {
  if (!req.user.identities[0].user_id) {
    return res.status(401).json({ errors: "Not Authenticaed" });
  }

  let user = await User.findOne({
    where: {
      email: req.user.email,
    },
  });

  if (user === null) {
    user = User.build({
      username: req.user.nickname,
      email: req.user.email,
      authId: req.user.identities[0].user_id,
    });
    try {
      await user.save();
    } catch (err) {
      return res.status(422).json({ error: "User creation failed." });
    }
    req.session.userId = user.id;
    req.session.save();
  }

  return res.json(user.dataValues.id);
});
