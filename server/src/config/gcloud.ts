import admin from 'firebase-admin';
import serviceAccount from './gcloudKey.json';

admin.initializeApp({
	// @ts-ignore
	credential: admin.credential.cert(serviceAccount),
	// storageBucket: process.env.APP_URL,
});

export const bucket = admin.storage().bucket();
