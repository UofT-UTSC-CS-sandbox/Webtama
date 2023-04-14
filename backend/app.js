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
import axios from "axios";

const PORT = 3000;
export const app = express();
const httpServer = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("static"));
const corsOptions = {
  origin: "https://webtama.works",
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

app.post("/jeers", async (req, res) => {
  console.log(req.body.Body);
  const sms = req.body.Body;
  let message = sms.split(":");
  const room = message[0];
  const text = message[1];
  io.to(room).emit("jeer", text);
  return res.json({ message: "Jeer sent." });
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
    success_url: `https://webtama.works`,
    cancel_url: "https://webtama.works",
  });
  return res.json(session.id);
});

const endpointSecret =
  "whsec_13YNdLPuRsjTpRSQScmvwfB6CPusM4Mf";

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

const io = new Server(httpServer, {
  cors: {
    origin: "https://webtama.works",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  },
});

// const io = new Server(httpServer, {
//   cors: {
//     origin: "https://webtama.works",
//     methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
//   },
//   handlePreflightRequest: (req, res) => {
//     const headers = {
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//         "Access-Control-Allow-Origin": "https://webtama.works", //or the specific origin you want to give access to,
//         "Access-Control-Allow-Credentials": true
//     };
//     res.writeHead(200, headers);
//     res.end();
//   }
// });

// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join room", (data) => {
    const roomId = data.roomId;
    const playerName = data.playerName;
    console.log("join room", data.roomId, data);
    socket.join(roomId);
    io.to(roomId).emit("player joined", playerName);
  });

  socket.on("leave room", (data) => {
    const roomId = data.roomId;
    const playerName = data.playerName;
    // fetch(`https://api.webtama.works/api/rooms/${roomId}/leave`, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "*",
    //   },
    //   body: JSON.stringify({
    //     playerName: playerName,
    //   }),
    // });
    try {
      const response = axios.patch(`https://api.webtama.works/api/rooms/${roomId}/leave`, {
        playerName: playerName,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    io.to(roomId).emit("player left", playerName);
    socket.leave(roomId);
    console.log("leave room", data.roomId, data);
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
        body: "some moved",
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
  else console.log("HTTP server on http://webtama.works:%s", PORT);
});
