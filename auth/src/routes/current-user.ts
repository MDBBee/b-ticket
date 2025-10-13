import express from 'express';
import { currentUser } from '@b-tickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  if (req.currentUser) {
    return res.send({ currentUser: req.currentUser });
  }

  res.send({ currentUser: null });
});

export { router as currentUserRouter };
