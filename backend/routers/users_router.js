import { User } from "../models/users.js";
import { Router } from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import pkg from "@sendgrid/mail"

export const usersRouter = Router();
const upload = multer({ dest: "uploads/" });

usersRouter.post("/signup", async (req, res) => {
  const user = User.build({
    username: req.body.username,
    email: req.body.email,
  });
  // generate password - salted and hashed
  /** 
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);
  */
  try {
    await user.save();
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: "User creation failed." });
  }
  req.session.userId = user.id;
  req.session.save();
  const sgMail = pkg;
  sgMail.setApiKey("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")
  console.log(sgMail)
  const msg = {
    to: user.email,
    from: 'jeffreyhe406@gmail.com',
    subject: 'Account created successfully',
    text: 'Welcome to the Webtama!',
    html: '<strong>Enjoy!</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    });
});

//Get all users
usersRouter.get("/", async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

usersRouter.post("/signin", async (req, res) => {
  console.log(req.body);
  let user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user === null) {
    user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
  }
  if (user === null) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }
  // password incorrect
  /** 
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }
  */

  req.session.userId = user.id;
  req.session.save();
  console.log(req.session);
  return res.json(user);
});

usersRouter.get("/signout", function (req, res, next) {
  req.session.destroy();
  return res.json({ message: "Signed out." });
});

usersRouter.get("/me", async (req, res) => {
  const auth0Token = req.headers.authorization?.replace("Bearer ", "");

  if (!auth0Token) {
    return res.status(401).json({ errors: "Not Authenticated" });
  }

  const user = await User.findOne({
    where: {
      auth0Token,
    },
  });

  if (!user) {
    return res.status(401).json({ errors: "User not found" });
  }

  return res.json({
    userId: user.id,
  });
});
