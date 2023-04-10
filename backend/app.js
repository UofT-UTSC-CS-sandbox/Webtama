import { sequelize } from "./datasource.js";
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { usersRouter } from "./routers/users_router.js";
import { roomRouter } from "./routers/rooms_router.js";
import session from "express-session";
import cors from "cors";
// import { io } from "socket.io-client";
import { Server } from "socket.io";
import sgMail from "@sendgrid/mail";
import Twilio from "twilio";
import { User } from "./models/users.js";
import Stripe from "stripe";

const PORT = 3000;
export const app = express();
const httpServer = http.createServer(app);
app.use(bodyParser.json());

app.use(express.static("static"));
const corsOptions = {
  // origin: "http://localhost:4200",
  origin: "http://webtama.works",
  // origin: "http://159.203.48.39",
  credentials: true,
};
app.use(cors(corsOptions));

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// const accountSid = "AC2476bdfeea3e34264f12f4552759a27f";
// const authToken = "b01d56523b6d91da88a8b75e3ec3b265";
// const client = Twilio(accountSid, authToken);

// client.messages
//   .create({
//     body: "This is the ship that made the Kessel Run in fourteen parsecs?",
//     from: "+14345955403",
//     to: "+14168316858", //testing phone number
//   })
//   .then((message) => console.log(message.sid));

app.use(
  session({
    secret: process.env.SECRET_KEY || "test",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/users", usersRouter);
app.use("/api/rooms", roomRouter);

const stripe = new Stripe(
  "sk_test_51MtDc1HEHppe6KHvbhT7kiix08CN8rZVjUCZl6yacwdB9QGf5ulQxD5DgkjOHbyqoWImyDff5SrKrzCNGs8PK5Ud00jFsKaY4I"
);
app.post("/create-checkout-session", async (req, res) => {
  console.log(req.body.userId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    metadata: { userId: `${req.body.userId}` },
    line_items: [
      {
        price: "price_1MtKfKHEHppe6KHv8l56iixx",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://webtama.works`,
    cancel_url: "http://webtama.works",
  });
  return res.json(session.id);
});

// Find your endpoint's secret in your Dashboard's webhook settings
const endpointSecret =
  "whsec_d4f160cfaa691bec75a1f1b0a84a626ca7f05593170cafbdcbf7313b9a31dc28";

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const payload = req.body;
    if (payload.type === "checkout.session.completed") {
      const user = await User.findByPk(payload.data.object.metadata.userId);
      if (!user) {
        return res.status(400).end();
      } else {
        user.premium = true;
        await user.save();
        console.log(user);
      }
    }
    return res.status(200).end();
  }
);

// app.use("/api/rooms", boardRouter);

// Socket.io
// Initialize Redis client instance
// const redisClient = redis.createClient();

// var webAuth = new auth0.WebAuth({
//   domain: 'dev-0rubju8i61qqpmgv.us.auth0.com',
//   clientID: 'dibFRURk5XSOdzcA66JIBCs4n38zwein'
// });

// // Parse the URL and extract the Access Token
// webAuth.parseHash(window.location.hash, function(err, authResult) {
//   if (err) {
//     return console.log(err);
//   }
//   webAuth.client.userInfo(authResult.accessToken, function(err, user) {
//       console.log(user);
//   });
// });

const io = new Server(httpServer, {
  cors: {
    // origin: "http://localhost:4200",
    // origin: "http://159.203.48.39",
    origin: "https://webtama.works",
    methods: ["GET", "POST"],
  },
});
// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join room", (data) => {
    const roomId = data.roomId;
    const playerName = data.playerName;
    socket.join(roomId);
    console.log("join room", data.roomId, data);
    io.to(roomId).emit("player joined", playerName);
  });

  socket.on("leave room", (data) => {
    const roomId = data.roomId;
    const playerName = data.playerName;
    // Leave the specified room
    fetch("http://webtama.works:3000/api/rooms/" + roomId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: playerName,
      }),
    });
    socket.leave(roomId);
    console.log("leave room", data.roomId, data);
    io.to(roomId).emit("player left", playerName);
  });

  // Handle the 'move' event when a player makes a move in the game
  socket.on("move", (data) => {
    const roomId = data.roomId;
    // Make a move in the specified game room and notify all players in the room
    console.log("move roomId:", roomId, data);
    io.to(roomId).emit("game state updated");
    // send sms to player
    // const accountSid = "ACc746786f25d6927c3eb29d72c4775f8a";
    // const authToken = "0dc8051c79979dd0ec148b75ed9963ee";
    // const client = Twilio(accountSid, authToken);

    // client.messages
    //   .create({
    //     body:
    //       "Move has been made!" +
    //       data.startx +
    //       data.starty +
    //       data.endx +
    //       data.endy,
    //     from: "+15855951945",
    //     to: "+16475703028", //testing phone number
    //   })
    //   .then((message) => console.log(message.sid));
    //
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://webtama.works:%s", PORT);
});
