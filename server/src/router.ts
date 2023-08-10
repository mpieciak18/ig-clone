import { Router } from 'express';
import { body } from 'express-validator';
import { deleteUser, updateUser } from './handlers/user';
import { handleInputErrors } from './modules/middleware';

const router = Router();

// // // // // //
//    Users    //
// // // // // //

// Update a user's account
router.put(
	'/user',
	body('email').optional().isEmail(),
	body('username').optional().isString(),
	body('password').optional().isString(),
	body('name').optional().isString(),
	body('bio').optional().isString(),
	body('image').optional().isString(),
	handleInputErrors,
	updateUser
);
// Delete a user's account
router.delete('/user', body('userId').isInt(), handleInputErrors, deleteUser);

// // // // // //
//   Follows   //
// // // // // //

// Gets a user's given follows (e.g., to see who they follow)
router.get('/follows/given');
// Gets a user's received follows (e.g., to see their followers)
router.get('/follows/received');
// Creates a new follow when one user (the giver) follows another (the receiver)
router.post('/follows');
// Deletes a follow when one user (the giver) unfollows another (the receiver)
router.delete('/follows');

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
