import express from 'express';
import jwt from 'jsonwebtoken';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  if (req.currentUser) {
    return res.send({ currentUser: req.currentUser });
  }

  res.send({ currentUser: null });
});

export { router as currentUserRouter };
