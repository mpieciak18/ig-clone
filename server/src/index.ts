import * as dotenv from 'dotenv';
dotenv.config();
import { config } from './config/index';
import app from './server';

app.listen(config.port, () => {
	console.log(`hello on http://localhost:${config.port}`);
});

process.on('uncaughtException', () => {
	console.log('uncaught exception (sync) at top level of node process');
});

process.on('unhandledRejection', () => {
	console.log('unhandled rejection (async) at top level of node process');
});
