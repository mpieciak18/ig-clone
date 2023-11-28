import { validationResult } from 'express-validator';
import { bucket } from '../config/gcloud';
import { randomUUID } from 'crypto';

export const handleInputErrors = (req, res, next) => {
	console.log(req.body);
	const errors = validationResult(req);
	console.log(errors);
	if (!errors.isEmpty()) {
		res.status(400);
		res.json({ errors: errors.array() });
	} else {
		next();
	}
};

export const uploadImage = async (req, res, next) => {
	try {
		if (!req.file && req.path == '/user') {
			next();
			return;
		} else if (!req.file && req.path != '/user') {
			res.status(400).send();
			return;
		}
		const fileName = randomUUID();
		try {
			await bucket.file(fileName).save(req.file.buffer, {
				contentType: req.file.mimetype,
			});
			const image = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
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
