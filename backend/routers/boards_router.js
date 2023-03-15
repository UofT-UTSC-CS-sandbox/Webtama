import { Router } from 'express';
import { isAuthenticated } from '../middleware/helpers';
import { Board } from '../models/boards';

const boardRouter = Router();


//get board route
boardRouter.get("/:id", async (req, res, next) => {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res
        .status(404)
        .json({ error: `Room(id=${req.params.id}) not found.` });
    }
    const board = await room.getBoard();
    if (!board) {
      return res
        .status(404)
        .json({ error: `Board(id=${req.params.id}) not found.` });
    }

    return res.json(board);
});

//move piece/patch board
boardRouter.patch("/:id", isAuthenticated, async (req, res, next) => {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
        return res
        .status(404)
        .json({ error: `Room(id=${req.params.id}) not found.` });
    }
    const board = await room.getBoard();
    if (!board) {
        return res
        .status(404)
        .json({ error: `Board(id=${req.params.id}) not found.` });
    }

    const piece = await board.getPiece({
        where: {
        xpos: req.body.startx,
        ypos: req.body.starty,
        },
    });
    if (!piece) {
        return res
        .status(404)
        .json({ error: `Piece(id=${req.params.id}) not found.` });
    }

    //check if the piece lands on another piece
    const piece2 = await board.getPiece({
        where: {
        xpos: req.body.endx,
        ypos: req.body.endy,
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
