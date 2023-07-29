import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './modules/auth';
import { signIn, createNewUser } from './handlers/user';

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
app.post('/create_new_user', createNewUser);
app.post('/sign_in', signIn);

// synchronous error handler
// // add code once all handlers + auth middleware are created // //

export default app;
