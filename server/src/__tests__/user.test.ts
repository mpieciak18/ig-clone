import app from '../server';
import supertest from 'supertest';

describe('POST /create_new_user', () => {
	it('should create a new user & return a web token + a 200 status', async () => {
		const response = await supertest(app).post('/create_new_user').send({
			email: 'test@test.com',
			username: 'test22',
			password: 'easy_as_abc_123',
			name: 'Tester',
			bio: "I'm a test account.",
			image: 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
		});
		expect(response.body.token).toBeDefined();
		expect(response.status).toBe(200);
	});
	it('should fail to create a new user & return a 400 status', async () => {
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
});

describe('POST /sign_in', () => {
	it('should login & return a web token + a 200 status', async () => {
		const response = await supertest(app).post('/sign_in').send({
			username: 'test22',
			password: 'easy_as_abc_123',
		});
		expect(response.body.token).toBeDefined();
		expect(response.status).toBe(200);
	});
});
