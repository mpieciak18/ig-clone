import app from '../server';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { comparePasswords } from '../modules/auth';
import { it, describe, expect } from 'vitest';

describe('POST /create_new_user & DELETE /api/user', () => {
	let token;
	it('should fail to create a new user due to missing inputs & return a 401 status', async () => {
		const response = await supertest(app).post('/create_new_user').send({
			email: 'test@test.com',
			username: 'test22',
			password: 'easy_as_abc_123',
			bio: "I'm a test account.",
			image: 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
		});
		expect(response.status).toBe(400);
	});
	it('should fail to create a new user due to an invalid email & return a 401 status', async () => {
		const response = await supertest(app).post('/create_new_user').send({
			email: 'this_is_not_an_email',
			username: 'test22',
			password: 'easy_as_abc_123',
			name: 'Tester',
			bio: "I'm a test account.",
			image: 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
		});
		expect(response.status).toBe(400);
	});
	it('should create a new user & return a web token + a 200 status', async () => {
		const response = await supertest(app).post('/create_new_user').send({
			email: 'test@test.com',
			username: 'test22',
			password: 'easy_as_abc_123',
			name: 'Tester',
			bio: "I'm a test account.",
			image: 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
		});
		token = response.body.token;
		expect(token).toBeDefined();
		expect(response.status).toBe(200);
	});
	it('should fail to create a new user due to it already existing & return a 400 status', async () => {
		const response = await supertest(app).post('/create_new_user').send({
			email: 'test@test.com',
			username: 'test22',
			password: 'easy_as_abc_123',
			name: 'Tester',
			bio: "I'm a test account.",
			image: 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
		});
		expect(response.status).toBe(400);
	});
	it('should fail to delete a user due to a missing user id field within the auth token & return a 500 status', async () => {
		const fakeToken = jwt.sign(
			{
				username: 'fake_user',
			},
			process.env.JWT_SECRET
		);
		const response = await supertest(app)
			.delete('/api/user')
			.set('Authorization', `Bearer ${fakeToken}`);
		expect(response.status).toBe(500);
	});
	it('should fail to delete a user due to a lack of auth token & return a 401 status', async () => {
		const response = await supertest(app)
			.delete('/api/user')
			.set('Authorization', `Bearer ${'test'}`);
		expect(response.status).toBe(401);
	});
	it('should delete a user due & return a 200 status', async () => {
		const response = await supertest(app)
			.delete('/api/user')
			.set('Authorization', `Bearer ${token}`);
		expect(response.status).toBe(200);
	});
});

describe('POST /sign_in, POST /api/user/single, & PUT /api/user', () => {
	let token;
	let otherToken;
	const initUser = {
		email: 'test11@test11.com',
		username: 'test11',
		password: '123_abc',
		name: 'Tester',
		bio: "I'm a test account.",
		image: 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
	};
	const otherUser = {
		email: 'test69@test69.com',
		username: 'test69',
		password: '123_abc',
		name: 'Tester',
		bio: "I'm a test account.",
		image: 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
	};
	let ogUser;
	const newUser = {
		email: 'test12345@test12345.com',
		username: 'test12345',
		password: '456_dfe',
		name: 'TESTER',
		image: 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png',
		bio: 'whattup',
	};
	it('should create both accounts, login with first account & return a web token + user + a 200 status', async () => {
		await supertest(app).post('/create_new_user').send(initUser);
		const otherRes = await supertest(app)
			.post('/create_new_user')
			.send(otherUser);
		const username = initUser.username;
		const password = initUser.password;
		const response = await supertest(app).post('/sign_in').send({
			username,
			password,
		});
		token = response.body.token;
		ogUser = response.body.user;
		ogUser.password = password;
		otherToken = otherRes.body.token;
		expect(token).toBeDefined();
		expect(otherToken).toBeDefined();
		expect(response.status).toBe(200);
	});
	//
	it('should fail to login with fake username & return a 401 status', async () => {
		const response = await supertest(app).post('/sign_in').send({
			username: 'fake_test',
			password: '123_abc',
		});
		expect(response.status).toBe(401);
	});
	it('should fail to login with an incorrect password & return a 401 status', async () => {
		const response = await supertest(app).post('/sign_in').send({
			username: 'test11',
			password: 'OOPS!',
		});
		expect(response.status).toBe(401);
	});
	it('should fail to login with invalid inputs (ie, no username) & return a 400 status', async () => {
		const response = await supertest(app).post('/sign_in').send({
			password: '123_abc',
		});
		expect(response.status).toBe(400);
	});
	it('should fail to login with invalid inputs (ie, no password) & return a 400 status', async () => {
		const response = await supertest(app).post('/sign_in').send({
			username: 'test11',
		});
		expect(response.status).toBe(400);
	});
	//
	it('should fail to find a user due to a non-existent id & return a 500 status', async () => {
		const response = await supertest(app)
			.post('/api/user/single')
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: 2,
			});
		expect(response.status).toBe(500);
	});
	it('should fail to find a user due to a invalid inputs & return a 400 status', async () => {
		const response = await supertest(app)
			.post('/api/user/single')
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: 'abc',
			});
		expect(response.status).toBe(400);
	});
	it('should fail to find a user due to a missing auth token & return a 401 status', async () => {
		const response = await supertest(app)
			.post('/api/user/single')
			.set('Authorization', `Bearer `)
			.send({
				id: ogUser.id,
			});
		expect(response.status).toBe(401);
	});
	it('should find a user & return a 200 status + correct user info', async () => {
		const response = await supertest(app)
			.post('/api/user/single')
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: ogUser.id,
			});
		const user = response.body.user;
		const passwordsMatch = await comparePasswords(
			ogUser.password,
			user.password
		);
		expect(response.status).toBe(200);
		expect(user.email == ogUser.email).toBeTruthy();
		expect(user.username == ogUser.username).toBeTruthy();
		expect(passwordsMatch).toBeTruthy();
		expect(user.name == ogUser.name).toBeTruthy();
		expect(user.image == ogUser.image).toBeTruthy();
		expect(user.bio == ogUser.bio).toBeTruthy();
	});
	//
	it('should fail to update the user due to no auth token & return a 401 status', async () => {
		const response = await supertest(app)
			.put('/api/user')
			.set('Authorization', `Bearer`)
			.send({
				email: newUser.email,
				username: newUser.username,
				password: newUser.password,
				name: newUser.name,
				image: newUser.image,
				bio: newUser.bio,
			});
		expect(response.status).toBe(401);
	});
	it('should fail to update the user due to invalid inputs & return a 400 status', async () => {
		const response = await supertest(app)
			.put('/api/user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'this is not an email',
			});
		expect(response.status).toBe(400);
	});
	it('should fail to update the user due to duplicate email/username & return a 400 status', async () => {
		const response = await supertest(app)
			.put('/api/user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: otherUser.email,
				username: otherUser.username,
			});
		expect(response.status).toBe(400);
	});
	it('should update the user & return a 200 status + updated user attributes', async () => {
		const response = await supertest(app)
			.put('/api/user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: newUser.email,
				username: newUser.username,
				password: newUser.password,
				name: newUser.name,
				image: newUser.image,
				bio: newUser.bio,
			});
		const user = response.body.user;
		const passwordsMatch = await comparePasswords(
			newUser.password,
			user.password
		);
		expect(response.status).toBe(200);
		expect(user.email == newUser.email).toBeTruthy();
		expect(user.username == newUser.username).toBeTruthy();
		expect(passwordsMatch).toBeTruthy();
		expect(user.name == newUser.name).toBeTruthy();
		expect(user.image == newUser.image).toBeTruthy();
		expect(user.bio == newUser.bio).toBeTruthy();
	});
	it('should update (revert) the user & return a 200 status + reverted user attributes', async () => {
		const response = await supertest(app)
			.put('/api/user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: ogUser.email,
				username: ogUser.username,
				password: ogUser.password,
				name: ogUser.name,
				image: ogUser.image,
				bio: ogUser.bio,
			});
		const user = response.body.user;
		const passwordsMatch = await comparePasswords(
			ogUser.password,
			user.password
		);
		expect(response.status).toBe(200);
		expect(user.email == ogUser.email).toBeTruthy();
		expect(user.username == ogUser.username).toBeTruthy();
		expect(passwordsMatch).toBeTruthy();
		expect(user.name == ogUser.name).toBeTruthy();
		expect(user.image == ogUser.image).toBeTruthy();
		expect(user.bio == ogUser.bio).toBeTruthy();
		await supertest(app)
			.delete('/api/user')
			.set('Authorization', `Bearer ${token}`);
		await supertest(app)
			.delete('/api/user')
			.set('Authorization', `Bearer ${otherToken}`);
	});
});
