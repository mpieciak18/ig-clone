import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './modules/auth';
import { signIn, createNewUser } from './handlers/user';
import { handleInputErrors } from './modules/middleware';
import { body } from 'express-validator';

// init express
const app = express();

// default middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// test handler
app.get('/', (req, res) => {
	res.status(200);
	res.json({ message: 'hello' });
});

// auth middleware
app.use('/api', protect, router);
// user handlers
app.post(
	'/create_new_user',
	body('email').isEmail(),
	body('username').isString().isLength({ min: 3, max: 15 }),
	body('password').isString().isLength({ min: 4 }),
	body('name').isString().isLength({ min: 3, max: 30 }),
	handleInputErrors,
	createNewUser
);
app.post(
	'/sign_in',
	body('email').isEmail(),
	body('password').isString(),
	handleInputErrors,
	signIn
);

// synchronous error handler
app.use((err, req, res, next) => {
	if (err.type === 'auth') {
		res.status(401);
		res.json({ message: 'unauthorized' });
	} else if (err.type === 'input') {
		res.status(400);
		res.json({ message: 'invalid input' });
	} else {
		res.status(500);
		res.json({ message: 'server error' });
	}
});

export default app;
