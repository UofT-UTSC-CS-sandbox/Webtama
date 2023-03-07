import { Router } from "express";
import { Room } from "../models/room.js";
import { isAuthenticated } from "../middleware/helpers.js";

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
        UserId: req.session.userId,
    });
    return res.json(room);
    }
);

roomRouter.get("/", async (req, res, next) => {
    const rooms = await Room.findAll({
        limit: 5,
        include: { association: "User", attributes: ["username"] },
    });
    return res.json({ rooms });
});

roomRouter.patch("/:id/", isAuthenticated, async (req, res, next) => {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
        return res
            .status(404)
            .json({ error: `Room(id=${req.params.id}) not found.` });
    }
    if (req.body.action === "upvote") {
        await room.increment({ upvote: 1 });
    } else if (req.body.action === "downvote") {
        await room.increment({ downvote: 1 });
    }
    await room.reload();
    return res.json(room);
});


roomRouter.delete("/:id/", isAuthenticated, async (req, res, next) => {
    const room = await Room.findByPk(req.params.id);
    if (room) {
        if (room.UserId !== req.session.userId) {
            res
                .status(403)
                .json({ error: "You are not authorized to delete this room." });
        } else {
            await room.destroy();
            return res.json(room);
        }
    } else {
        return res
            .status(404)
            .json({ error: `Room(id=${req.params.id}) not found.` });
    }
}
);

