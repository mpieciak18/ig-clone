import { Router } from 'express';
import { body } from 'express-validator';
import { deleteUser, updateUser } from './handlers/user';
import { handleInputErrors } from './modules/middleware';
import {
	createFollow,
	deleteFollow,
	findFollow,
	getGivenFollows,
	getReceivedFollows,
} from './handlers/follow';
import { createPost, deletePost } from './handlers/post';
import multer from 'multer';

// export const upload = multer({
// 	storage: multer.memoryStorage(),
// 	limits: {
// 		fileSize: 5 * 1024 * 1024, // limit to 5MB
// 	},
// });

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

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
router.post(
	'/follow/given',
	body('id').isInt(),
	handleInputErrors,
	getGivenFollows
);
// Gets a user's received follows (e.g., to see their followers)
router.post(
	'/follow/received',
	body('id').isInt(),
	handleInputErrors,
	getReceivedFollows
);
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
router.get('/post/all');
// Gets (a limited number of) a user's posts
router.get('/post/user');
// Gets a single post
router.get('/post/:id');
// Creates a new post
router.post(
	'/post',
	upload.single('file'),
	body('caption').isString(),
	handleInputErrors,
	createPost
);
// Updates a single post
router.put('/post');
// Deletes a single post
router.delete('/post', body('id').isInt(), handleInputErrors, deletePost);

// synchronous error handler
// // add code once all handlers + auth middleware are created // //

export default router;
