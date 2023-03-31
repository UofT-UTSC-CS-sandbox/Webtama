import { Router } from "express";
import { Room } from "../models/rooms.js";
import { User } from "../models/users.js";
import { isAuthenticated } from "../middleware/helpers.js";
import { Board } from "../models/boards.js";
import { Piece } from "../models/pieces.js";

export const roomRouter = Router();

roomRouter.post("/", async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Room name is required." });
  }
  const room = await Room.create({
    name: req.body.name,
    Host: null,
    Guest: null,
  });
  return res.json(room.id);
});

roomRouter.get("/:id/", async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  return res.json({ room });
});

roomRouter.patch("/:id/join", async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  console.log(req.body);
  const user = await User.findByPk(req.body.userId);
  if (!user) {
    return res
      .status(404)
      .json({ error: `User(id=${req.body.userId}) not found.` });
  }

  user.activeRoom = room.id;
  await user.save();

  if (room.Host === null) {
    room.Host = user.id;
  } else if (room.Guest === null) {
    room.Guest = user.id;
  }
  await room.save();
  await room.reload();
  await user.reload();
  return res.json(room);
});

roomRouter.patch("/:id/join", async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(405)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  const user = await User.findByPk(req.body.userId);
  if (!user) {
    return res
      .status(405)
      .json({ error: `User(id=${req.body.userId}) not found.` });
  }

  const userId = req.body.userId;

  if (room.Host === req.body.userId) {
    room.Host = null;
  } else if (room.Guest === req.body.userId) {
    room.Guest = null;
  }
  user.activeRoom = null;
  await user.save();
  await room.save();
  await room.reload();
  await user.reload();
  return res.json(room);
});

roomRouter.get("/", async (req, res, next) => {
  const rooms = await Room.findAll({
    limit: 5,
  });
  return res.json({ rooms });
});

roomRouter.post("/:id/boards/", async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  const board = await Board.create({
    turn: 0,
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
roomRouter.patch("/:id/boards", async (req, res, next) => {
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
  return res.json({ pieces });
});
