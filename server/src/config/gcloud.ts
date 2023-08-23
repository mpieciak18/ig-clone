import admin from 'firebase-admin';
import serviceAccount from './gcloudKey.json';

admin.initializeApp({
	// @ts-ignore
	credential: admin.credential.cert(serviceAccount),
	storageBucket: process.env.APP_URL,
});

export const bucket = admin.storage().bucket();

export const deleteFileFromStorage = async (publicUrl) => {
	try {
		// Assuming the URL structure is like: `https://storage.googleapis.com/<bucket-name>/<file-name>`
		const fileName = publicUrl.split('/').pop(); // This extracts the file name from the URL

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
