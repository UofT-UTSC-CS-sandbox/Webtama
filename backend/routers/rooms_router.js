import { Router } from "express";
import { Room } from "../models/rooms.js";
import { isAuthenticated } from "../middleware/helpers.js";
import { Board } from "../models/boards.js";

export const roomRouter = Router();

// Endpoint for creating a new game room
// app.post('/api/rooms', (req, res) => {
//     // Create a new game room and return its ID
//     const roomId = createNewGameRoom();
//     res.json({ roomId });
//   });

//   // Endpoint for joining a game room
//   app.post('/api/rooms/:roomId/join', (req, res) => {
//     const roomId = req.params.roomId;
//     // Join the specified game room and return the current state of the game
//     const gameState = joinGameRoom(roomId);
//     res.json(gameState);
//   });

//   // Endpoint for making a move in the game
//   app.post('/api/rooms/:roomId/move', (req, res) => {
//     const roomId = req.params.roomId;
//     const move = req.body.move;
//     // Make a move in the specified game room and return the updated state of the game
//     const gameState = makeMove(roomId, move);
//     res.json(gameState);
//   });

// Endpoint for creating a new game room
roomRouter.post("/", isAuthenticated, async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Room name is required." });
  }
  const room = await Room.create({
    name: req.body.name,
    Host: null,
    Guest: null,
  });
  return res.json(room);
});

roomRouter.get("/:id/", async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  return res.json(room);
});

// Add user to room
roomRouter.post("/:id/join", isAuthenticated, async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }

  await room.addUser(req.session.userId);
  await room.reload();
  return res.json(room);
});

//get all rooms
roomRouter.get("/", async (req, res, next) => {
  const rooms = await Room.findAll({
    limit: 5,
    // include: { association: "User", attributes: ["username"] },
  });
  return res.json({ rooms });
});

//create board route
roomRouter.post("/:id/boards", isAuthenticated, async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  if (room.UserId !== req.session.userId) {
    return res
      .status(403)
      .json({ error: "You are not authorized to create a board." });
  }
  const board = await Board.create({
    RoomId: req.params.id,
  });

  for (let i = 1; i <= 5; i++) {
    if (i === 3) continue;
    await Piece.create({
      xpos: i,
      ypos: 1,
      type: "pawn",
      side: 0,
      BoardId: board.id,
    });
  }
  for (let i = 1; i <= 5; i++) {
    if (i === 3) continue;
    await Piece.create({
      xpos: i,
      ypos: 5,
      type: "pawn",
      side: 1,
      BoardId: board.id,
    });
  }

  await Piece.create({
    xpos: 3,
    ypos: 1,
    type: "king",
    side: 0,
    BoardId: board.id,
  });
  await Piece.create({
    xpos: 3,
    ypos: 5,
    type: "king",
    side: 1,
    BoardId: board.id,
  });

  await board.reload();
  return res.json(board);
});

//get board route
roomRouter.get("/:id/boards", async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  const board = await Board.findOne({ where: { RoomId: req.params.id } });
  if (!board) {
    return res
      .status(404)
      .json({ error: `Board(id=${req.params.id}) not found.` });
  }
  return res.json(board);
});

//move piece/patch board
roomRouter.patch("/:id/boards", isAuthenticated, async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  const board = await Board.findOne({ where: { RoomId: req.params.id } });

  if (!board) {
    return res
      .status(404)
      .json({ error: `Board(id=${req.params.id}) not found.` });
  }

  const piece = await Piece.findOne({
    where: {
      xpos: req.body.startx,
      ypos: req.body.starty,
      BoardId: board.id,
    },
  });

  if (!piece) {
    return res
      .status(404)
      .json({ error: `Piece(id=${req.params.id}) not found.` });
  }

  //check if the piece lands on another piece
  const piece2 = await Piece.findOne({
    where: {
      xpos: req.body.endx,
      ypos: req.body.endy,
      BoardId: board.id,
    },
  });

  if (piece2) {
    await piece2.destroy();
  }

  //update piece position
  piece.xpos = req.body.endx;
  piece.ypos = req.body.endy;
  await piece.save();

  //update board
  board.turn = board.turn === 0 ? 1 : 0;
  await board.save();

  await board.reload();
  return res.json(board);
  // Emit the updated board to all clients
  // io.emit("board", board);
});

//get all pieces
roomRouter.get("/:id/boards/pieces", async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  const board = await Board.findOne({ where: { RoomId: req.params.id } });

  if (!board) {
    return res
      .status(404)
      .json({ error: `Board(id=${req.params.id}) not found.` });
  }
  const pieces = await Piece.findAll({ where: { BoardId: board.id } });
  return res.json(pieces);
});

// roomRouter.patch("/:id/", isAuthenticated, async (req, res, next) => {
//     const room = await Room.findByPk(req.params.id);
//     if (!room) {
//         return res
//             .status(404)
//             .json({ error: `Room(id=${req.params.id}) not found.` });
//     }
//     if (req.body.action === "upvote") {
//         await room.increment({ upvote: 1 });
//     } else if (req.body.action === "downvote") {
//         await room.increment({ downvote: 1 });
//     }
//     await room.reload();
//     return res.json(room);
// });

// roomRouter.delete("/:id/", isAuthenticated, async (req, res, next) => {
//     const room = await Room.findByPk(req.params.id);
//     if (room) {
//         if (room.UserId !== req.session.userId) {
//             res
//                 .status(403)
//                 .json({ error: "You are not authorized to delete this room." });
//         } else {
//             await room.destroy();
//             return res.json(room);
//         }
//     } else {
//         return res
//             .status(404)
//             .json({ error: `Room(id=${req.params.id}) not found.` });
//     }
// }
// );
