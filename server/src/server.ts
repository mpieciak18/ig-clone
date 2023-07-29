import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';

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

// add auth/user middleware & handlers
// // add code once auth/user middleware & handlers are created // //

// synchronous error handler
// // add code once all handlers + auth middleware are created // //

export default app;
