import { validationResult } from 'express-validator';
import { bucket } from '../config/gcloud';

export const handleInputErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400);
		res.json({ errors: errors.array() });
	} else {
		next();
	}
};

export const uploadImage = async (req, res, next) => {
	try {
		if (!req.file) {
			res.status(400).send();
			return;
		}

		const blob = bucket.file(req.file.originalname);

		const blobStream = blob.createWriteStream({
			metadata: {
				contentType: req.file.mimetype,
			},
		});

		blobStream.on('error', (err) => {
			res.status(500).send(err);
		});

		blobStream.on('finish', () => {
			const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
			req.imageUrl = publicUrl;
			next();
			// res.status(200).send({ imageUrl: publicUrl });
		});

		blobStream.end(req.file.buffer);
	} catch (error) {
		res.status(500).send(error);
	}
};
