import { sequelize } from "./datasource.js";
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { usersRouter } from "./routers/users_router.js";
import { roomRouter } from "./routers/rooms_router.js";
import session from "express-session";
import cors from "cors";
import { Server } from "socket.io";
import Twilio from "twilio";
import { User } from "./models/users.js";
import Stripe from "stripe";

const PORT = 3000;
export const app = express();
const httpServer = http.createServer(app);
app.use(bodyParser.json());

app.use(express.static("static"));
let corsOptions = {
  origin: ["http://localhost:4200"],
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

const accountSid = "ACc746786f25d6927c3eb29d72c4775f8a";
const authToken = "0dc8051c79979dd0ec148b75ed9963ee";
const client = Twilio(accountSid, authToken);

app.use(
  session({
    secret: process.env.SECRET_KEY || "test",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/users", usersRouter);
app.use("/api/rooms", roomRouter);

app.post("/jeer", async (req, res) => {
  let message = req.body.split(":");
  const room = message[0];
  const text = message[1];

  socket.join(room);
  socket.emit("crowd jeer", text);
  socket.leave(room);
});

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
    success_url: `http://localhost:4200`,
    cancel_url: "http://localhost:4200",
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
    origin: "http://localhost:4200",
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
    fetch("http://localhost:3000/api/rooms/" + roomId, {
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

  socket.on("jeer post", (data) => {
    const roomId = data.roomId;
    const message = data.message;
    io.to(roomId).emit("crowd jeer", message);
  });

  socket.on("move", (data) => {
    const roomId = data.roomId;
    console.log("move roomId:", roomId, data);
    io.to(roomId).emit("game state updated");

    client.messages
      .create({
        body: "Crowd:",
        from: "+15855951945",
        to: "+16475703028",
      })
      .then((message) => console.log(message.sid));
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
