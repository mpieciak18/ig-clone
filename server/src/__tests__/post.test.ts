import supertest from 'supertest';
import app from '../server';
import fetch, { Response } from 'node-fetch';
import FormData from 'form-data';

describe('POST /api/post & DELETE /api/post', () => {
	let token;
	let otherToken;
	const urlPattern = /^(http|https):\/\/[^ "]+$/;
	const user = {
		email: 'test44@test44.com',
		username: 'test44',
		password: '123_abc',
		name: 'Tester',
		bio: "I'm a test account.",
		image: 'https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
		id: undefined,
	};
	const otherUser = {
		email: 'test34567@test34567.com',
		username: 'test34567',
		password: '456_dfe',
		name: 'TESTER',
		image: 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png',
		bio: 'whattup',
		id: undefined,
	};
	const caption = 'this is a test';
	let post;
	it('should create both users, get own web token, other user id, & a 200 status', async () => {
		const response = await supertest(app)
			.post('/create_new_user')
			.send(user);
		token = response.body.token;
		expect(response.body.token).toBeDefined();
		user.id = response.body.user?.id;
		expect(response.body.user?.id).toBeDefined();
		expect(response.status).toBe(200);
		// // //
		const response2 = await supertest(app)
			.post('/create_new_user')
			.send(otherUser);
		otherToken = response2.body.token;
		otherUser.id = response2.body.user?.id;
		expect(response2.body.user?.id).toBeDefined();
		expect(response2.status).toBe(200);
	});
	it('should create a post & return a 200 error + correct post info', async () => {
		const img: Response = await fetch(post.file);
		const imgBlob = await img.blob();
		const formData = new FormData();
		formData.append('file', imgBlob);
		formData.append('caption', caption);
		const response = await supertest(app)
			.post('/api/post')
			.set('Authorization', `Bearer ${token}`)
			.send(formData);
		post = response.body.post;
		expect(response.status).toBe(200);
		expect(post?.userId).toBe(user.id);
		expect(post?.caption).toBe(caption);
		expect(post?.file).toMatch(urlPattern);
	});
	it('should delete a post & return a 200 error + correct post info', async () => {
		// const response = await supertest(app)
		// 	.delete('/api/follow')
		// 	.set('Authorization', `Bearer ${token}`)
		// 	.send({
		// 		id: follow.id,
		// 	});
		// expect(response.status).toBe(200);
		// expect(response.body.follow.giverId).toBe(user.id);
		// expect(response.body.follow.receiverId).toBe(otherUser.id);
		// expect(response.body.follow.id).toBe(follow.id);
		await supertest(app)
			.delete('/api/user')
			.set('Authorization', `Bearer ${token}`);
		await supertest(app)
			.delete('/api/user')
			.set('Authorization', `Bearer ${otherToken}`);
	});
});
