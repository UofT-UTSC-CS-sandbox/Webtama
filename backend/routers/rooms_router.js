import { Router } from "express";
import { Room } from "../models/rooms.js";
import { User } from "../models/users.js";
import { isAuthenticated } from "../middleware/helpers.js";
import { Board } from "../models/boards.js";
import { cards, shuffle } from "../models/cards.js";
import { Piece } from "../models/pieces.js";
import { where } from "sequelize";

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

roomRouter.patch("/match", async (req, res, next) => {
  const rooms = await Room.findAll({
    where: {
      Host: !null,
      Guest: null,
    },
    limit: 5,
  });

  if (rooms.length === 0) {
    return res.status(404).json({ error: "No rooms found." });
  }

  let maxMMR = 0;
  let foundRoom = -1;
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    const mmr = room.dataValues.Host.mmr;
    if (mmr > maxMMR) {
      maxMMR = mmr;
      foundRoom = room.dataValues.id;
    }
  }

  return res.json(foundRoom);
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
  const user = await User.findOne({
    where: {
      id: req.body.userId,
    },
  });
  if (!user) {
    return res
      .status(404)
      .json({ error: `User(id=${req.body.userId}) not found.` });
  }

  user.activeRoom = room.id;
  await user.save();

  if (!room.Host && room.Guest !== user.id) {
    room.Host = user.id;
  } else if (!room.Guest && room.Host !== user.id) {
    room.Guest = user.id;
  }
  await room.save();
  await room.reload();
  await user.reload();
  return res.json(room);
});

roomRouter.patch("/:id/leave", async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(405)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  const user = await User.findOne({
    where: {
      // id: req.body.userId,
      username: req.body.playerName,
    },
  });
  if (!user) {
    return res
      .status(405)
      .json({ error: `User(id=${req.body.userId}) not found.` });
  }

  const userId = req.body.userId;

  if (room.Host == req.body.userId) {
    room.Host = null;
  } else if (room.Guest == req.body.userId) {
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
  const rooms = await Room.findAll({});
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
  piece.xpos = req.body.endx;
  piece.ypos = req.body.endy;
  await piece.save();

  board.turn++;
  await board.save();

  await board.reload();
  return res.json(board);
});

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

roomRouter.patch("/:id/boards/turns", async (req, res, next) => {
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

  const user = await User.findOne({ where: { id: req.body.userId } });
  if (!user) {
    return res
      .status(404)
      .json({ error: `User(id=${req.params.id}) not found.` });
  }

  if (room.Host == user.id && board.turn % 2 === 0) {
    return res.json("aTeam");
  } else if (room.Guest == user.id && board.turn % 2 !== 0) {
    return res.json("bTeam");
  } else {
    return res.json("false");
  }
});

roomRouter.get("/:id/boards/wins", async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  const board = await Board.findOne({ where: { RoomId: req.params.id } });
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  if (!board) {
    return res
      .status(404)
      .json({ error: `Board(id=${req.params.id}) not found.` });
  }
  const pieces = await Piece.findAll({ where: { BoardId: board.id } });

  const Host = await User.findOne({ where: { id: room.Host } });
  const Guest = await User.findOne({ where: { id: room.Guest } });

  const kings = pieces.filter((piece) => piece.type === "king");
  if (kings.length === 1) {
    if (kings[0].side == 1) {
      if (Host) {
        Host.mmr += 10;
        Host.save();
        Host.reload();
      }
      return res.json(1);
    } else if (kings[0].side == 0) {
      if (Guest) {
        Guest.mmr += 10;
        Guest.save();
        Guest.reload();
      }
      return res.json(2);
    }
  }

  for (let i = 0; i < kings.length; i++) {
    const king = kings[i];
    const kingy = king.ypos;
    const kingSide = king.side;

    if (kingSide == 0 && kingy == 5) {
      if (Guest) {
        Guest.mmr += 10;
        Guest.save();
        Guest.reload();
      }

      return res.json(2);
    } else if (kingSide == 1 && kingy == 1) {
      if (Host) {
        Host.mmr += 10;
        Host.save();
        Host.reload();
      }

      return res.json(1);
    }
  }
  return res.json(-1);
});

roomRouter.patch("/:id/boards/draw", async (req, res, next) => {
  let room = await Room.findByPk(req.params.id);
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

  if (!board.card1) {
    const card1 = shuffle();
    board.card1 = JSON.stringify(card1);
  }
  while (!board.card2 || board.card2 === board.card1) {
    const card2 = shuffle();
    board.card2 = JSON.stringify(card2);
  }

  await board.save();
  await board.reload();
  return res.json(board);
});

roomRouter.patch("/:id/boards/play", async (req, res, next) => {
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

  if (req.body.card === 1) {
    board.card1 = null;
  } else if (req.body.card === 2) {
    board.card2 = null;
  }
  await board.save();
  await board.reload();
  return res.json(board);
});

roomRouter.delete("/:id/delete", async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res
      .status(404)
      .json({ error: `Room(id=${req.params.id}) not found.` });
  }
  await room.destroy();
  return res.json({ message: "Room deleted" });
});
