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
import Twilio from "twilio";

const PORT = 3000;
export const app = express();
const httpServer = http.createServer(app);
app.use(bodyParser.json());

app.use(express.static("static"));
const corsOptions = {
  origin: "http://localhost:4200",
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

const accountSid = "AC2476bdfeea3e34264f12f4552759a27f";
const authToken = "b01d56523b6d91da88a8b75e3ec3b265";
const client = Twilio(accountSid, authToken);

client.messages
  .create({
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: "+14345955403",
    to: "+14168316858", //testing phone number
  })
  .then((message) => console.log(message.sid));

app.use(
  session({
    secret: process.env.SECRET_KEY || "test",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/users", usersRouter);
app.use("/api/rooms", roomRouter);
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

  // Handle the 'move' event when a player makes a move in the game
  socket.on("move", (data) => {
    const roomId = data.roomId;
    // Make a move in the specified game room and notify all players in the room
    console.log("move roomId:", roomId, data);
    io.to(roomId).emit("game state updated");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
