import { sequelize } from "./datasource.js";
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { messagesRouter } from "./routers/messages_router.js";
import { usersRouter } from "./routers/users_router.js";
import { roomRouter } from "./routers/rooms_router.js";
// import { boardRouter } from "./routers/boards_router.js";
import session from "express-session";
import cors from "cors";
// import { io } from "socket.io-client";
import { Server } from "socket.io";
import redis from "redis";
import redisAdapter from "socket.io-redis";

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

app.use(
  session({
    secret: process.env.SECRET_KEY || "test",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/api/messages", messagesRouter);
app.use("/users", usersRouter);
app.use("/api/rooms", roomRouter);
// app.use("/api/rooms", boardRouter);

// Socket.io
// Initialize Redis client instance
// const redisClient = redis.createClient();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});
// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle the 'join room' event when a player joins a game room
  socket.on("join room", (data) => {
    const roomId = data.roomId;
    const playerName = data.playerName;
    // Join the specified game room and notify all players in the roeom
    socket.join(roomId);
    io.to(roomId).emit("player joined", playerName);
  });

  // Handle the 'move' event when a player makes a move in the game
  socket.on("move", (data) => {
    const roomId = data.roomId;
    // Make a move in the specified game room and notify all players in the room
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
