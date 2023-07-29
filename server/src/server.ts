import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';

// initialize express
const app = express();

// add default middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
	res.status(200);
	res.json({ message: 'hello' });
});

export default app;
