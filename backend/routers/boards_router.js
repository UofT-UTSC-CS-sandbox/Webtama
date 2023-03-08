import { Router } from 'express';
import { isAuthenticated } from '../middleware/helpers';
import { Board } from '../models/boards';

const boardRouter = Router();

boardRouter.get('/', isAuthenticated, async (req, res) => {
    Board.findAll()
        .then(boards => {
        res.json(boards);
        });
    }
);

boardRouter.get('/:id', isAuthenticated, async (req, res) => {
    Board.findById(req.params.id)
        .then(board => {
        res.json(board);
        });
    }
);

boardRouter.post('/', isAuthenticated, async (req, res) => {
    Board.create(req.body)
        .then(board => {
        res.json(board);
        });
    }
);

boardRouter.put('/:id', isAuthenticated, async (req, res) => {
    Board.update(req.body, { where: { id: req.params.id } })
        .then(board => {
        res.json(board);
        });
    }
);

boardRouter.delete('/:id', isAuthenticated, async (req, res) => {
    Board.destroy({ where: { id: req.params.id } })
        .then(board => {
        res.json(board);
        });
    }
);

// import { Pieces } from '/models/pieces.js';

// const pieceRouter = Router();

// pieceRouter.get('/', isAuthenticated, async (req, res) => {
//     Pieces.findAll()
//         .then(pieces => {
//         res.json(pieces);
//         });
//     }
// );

// pieceRouter.get('/:id', isAuthenticated, async (req, res) => {
//     Pieces.findById(req.params.id)
//         .then(piece => {
//         res.json(piece);
//         });
//     }
// );

// pieceRouter.post('/', isAuthenticated, async (req, res) => {
//     Pieces.create(req.body)
//         .then(piece => {
//         res.json(piece);
//         });
//     }
// );

// pieceRouter.put('/:id', isAuthenticated, async (req, res) => {
//     Pieces.update(req.body, { where: { id: req.params.id } })
//         .then(piece => {
//         res.json(piece);
//         });
//     }
// );

// pieceRouter.delete('/:id', isAuthenticated, async (req, res) => {
//     Pieces.destroy({ where: { id: req.params.id } })
//         .then(piece => {
//         res.json(piece);
//         });
//     }
// );
