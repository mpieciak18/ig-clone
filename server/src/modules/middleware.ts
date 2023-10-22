import { validationResult } from 'express-validator';
import { bucket } from '../config/gcloud';
import { randomUUID } from 'crypto';

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
	console.log(req.file);
	try {
		if (!req.file) {
			res.status(400).send();
			return;
		}
		const fileName = randomUUID();
		try {
			await bucket.file(fileName).save(req.file.buffer, {
				contentType: req.file.mimetype,
			});
			const image = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
			console.log(image);
			req.image = image;
			delete req.file;
			next();
			return;
		} catch (err) {
			res.status(500).send(err);
			return;
		}
	} catch (err) {
		res.status(500).send(err);
	}
};
