import { Router } from 'express';
import { body } from 'express-validator';
import { deleteUser, updateUser } from './handlers/user';
import { handleInputErrors } from './modules/middleware';
import { createFollow, deleteFollow, findFollow } from './handlers/follow';

const router = Router();

// // // // // //
//    Users    //
// // // // // //

// Update a user's account
router.put(
	'/user',
	body('email').optional().isEmail(),
	body('username').optional().isString().isLength({ min: 3, max: 15 }),
	body('password').optional().isString().isLength({ min: 4 }),
	body('name').optional().isString().isLength({ min: 3, max: 30 }),
	body('bio').optional().isString(),
	body('image').optional().isURL(),
	handleInputErrors,
	updateUser
);
// Delete a user's account
router.delete('/user', handleInputErrors, deleteUser);

// // // // // //
//   Follows   //
// // // // // //

// Gets a user's given follows (e.g., to see who they follow)
router.get('/follow/given');
// Gets a user's received follows (e.g., to see their followers)
router.get('/follow/received');
// Finds the follow data between the signed-in user & another user (if it exists)
router.post('/follow/user', body('id').isInt(), handleInputErrors, findFollow);
// Creates a follow when the signed-in user follows another user
router.post('/follow', body('id').isInt(), handleInputErrors, createFollow);
// Deletes a follow when the signed-in user unfollows another user
router.delete('/follow', body('id').isInt(), handleInputErrors, deleteFollow);

// // // // // //
//    Posts    //
// // // // // //

// Gets (a limited number of) posts for home page
router.get('/posts/all');
// Gets (a limited number of) a user's posts
router.get('/posts/user');
// Gets a single post
router.get('/posts/:id');
// Updates a single post
router.put('/posts');
// Deletes a single posts
router.delete('/posts');

// synchronous error handler
// // add code once all handlers + auth middleware are created // //

export default router;
