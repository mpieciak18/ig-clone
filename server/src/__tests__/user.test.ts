import app from '../server';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

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

describe('POST /sign_in', () => {
	it('should login & return a web token + a 200 status', async () => {
		const response = await supertest(app).post('/sign_in').send({
			username: 'test11',
			password: '123_abc',
		});
		expect(response.body.token).toBeDefined();
		expect(response.status).toBe(200);
	});
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
});
