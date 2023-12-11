import { initializeApp, cert } from 'firebase-admin/app';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import serviceAccount from './gcloudKey.json' assert { type: 'json' };
import { Bucket, File } from '@google-cloud/storage';

initializeApp({
	// @ts-ignore
	credential: cert(serviceAccount),
	storageBucket: process.env.APP_URL,
});

export const bucket: Bucket = getStorage().bucket();

export const getUrl = async (ref: File): Promise<string> => {
	const url = await getDownloadURL(ref);
	return url;
};

export const deleteFileFromStorage = async (url: string): Promise<void> => {
	try {
		// Assumes the URL structure is like : `https://firebasestorage.googleapis.com/v0/b/{appName}/o/{fileName}?alt={token}`
		const fileName = url
			.split(
				`https://firebasestorage.googleapis.com/v0/b/${process.env.APP_URL}/o/`
			)[1]
			.split('?alt=')[0];

		if (!fileName) {
			throw new Error("Couldn't extract file name from the URL");
		}

		// Now, you can delete the file from the bucket
		await bucket.file(fileName).delete();
		console.log(
			`Successfully deleted file ${fileName} from Firebase Storage.`
		);
	} catch (error) {
		console.error('Error deleting the file:', error);
	}
};
