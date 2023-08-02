import { Router } from 'express';
import { body } from 'express-validator';

const router = Router();

// // // // // //
//   Follow    //
// // // // // //

// Gets a user's given follows (e.g., to see who they follow)
router.get('/follow/given');
// Gets a user's received follows (e.g., to see their followers)
router.get('/follow/received');
// Creates a new follow when one user (the giver) follows another (the receiver)
router.post('/follow');
// Deletes a follow, based on follow id
router.delete('/follow/:id');

// synchronous error handler
// // add code once all handlers + auth middleware are created // //

export default router;
