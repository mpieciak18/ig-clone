import { prodPort, localPort, testingPort } from './ports';
import merge from 'lodash.merge';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const stage = process.env.STAGE || 'local';

let envConfig;
if (stage === 'production') {
	envConfig = prodPort;
} else if (stage === 'testing') {
	envConfig = testingPort;
} else {
	envConfig = localPort;
}

export const config = merge(
	{
		stage,
		env: process.env.NODE_ENV,
		port: 3001,
		secrets: {
			jwt: process.env.JWT_SECRET,
			dbUrl: process.env.DATABASE_URL,
		},
	},
	envConfig
);
