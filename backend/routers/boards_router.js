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
