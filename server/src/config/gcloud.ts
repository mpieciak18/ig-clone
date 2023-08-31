import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import serviceAccount from './gcloudKey.json';

initializeApp({
	// @ts-ignore
	credential: cert(serviceAccount),
	storageBucket: process.env.APP_URL,
});

export const bucket = getStorage().bucket();

export const deleteFileFromStorage = async (url) => {
	try {
		// Assuming the URL structure is like: `https://storage.googleapis.com/<bucket-name>/<file-name>`
		const fileName = url.split('/').pop();

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
