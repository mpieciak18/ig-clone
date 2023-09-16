import supertest from 'supertest';
import app from '../server';
import { it, describe, expect } from 'vitest';

const urlPattern = /^(http|https):\/\/[^ "]+$/;

describe('comments', () => {
	let token;
	const user = {
		email: 'test55@test55.com',
		username: 'test55',
		password: '123_abc',
		name: 'Tester',
		bio: "I'm a test account.",
		image: 'https://firebasestorage.googleapis.com/v0/b/ig-clone-5b7ab.appspot.com/o/lsNWDlodVDUB7RmeRY9qZDe1S3k2%2FScreenshot%202023-04-14%20at%2017-10-51%20Markstagram.png?alt=media&token=7a1080c3-c648-4ef4-b5e4-f6da3760182d',
		id: undefined,
	};
	const caption = 'testing, 1, 2, 3';
	let post;
	const message = 'this is a test';
	const updatedMessage = 'this is an updated message';
	const limit = 10;
	let comment;
	it('should create user, get web token, user id, & a 200 status', async () => {
		const response = await supertest(app)
			.post('/create_new_user')
			.send(user);
		token = response.body.token;
		expect(response.body.token).toBeDefined();
		user.id = response.body.user?.id;
		expect(response.body.user?.id).toBeDefined();
		expect(response.status).toBe(200);
	});
	it('should create a post & return a 200 error + correct post info', async () => {
		const response = await supertest(app)
			.post('/api/post')
			.set('Authorization', `Bearer ${token}`)
			.set('Content-Type', 'multipart/form-data')
			.field('caption', caption)
			.attach('file', './src/__tests__/test.png');
		post = response.body.post;
		expect(response.status).toBe(200);
		expect(post?.userId).toBe(user.id);
		expect(post?.caption).toBe(caption);
		expect(post?.image).toMatch(urlPattern);
	});
	//
	it('should fail to create a comment due to a non-existent post id & return a 500 code', async () => {
		const response = await supertest(app)
			.post('/api/comment')
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: 1,
				message,
			});
		expect(response.status).toBe(500);
	});
	it('should fail to create a comment due to an invalid inputs & return a 400 code', async () => {
		const response = await supertest(app)
			.post('/api/comment')
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: 'abc',
				message: 123,
			});
		expect(response.status).toBe(400);
	});
	it('should fail to create a comment due to a missing inputs & return a 400 code', async () => {
		const response = await supertest(app)
			.post('/api/comment')
			.set('Authorization', `Bearer ${token}`)
			.send({});
		expect(response.status).toBe(400);
	});
	it('should fail to create a comment due to a missing auth token & return a 401 code', async () => {
		const response = await supertest(app)
			.post('/api/comment')
			.set('Authorization', `Bearer`)
			.send({ id: post.id, message });
		expect(response.status).toBe(401);
	});
	it('should create a comment & return a 200 code + correct comment info', async () => {
		const response = await supertest(app)
			.post('/api/comment')
			.set('Authorization', `Bearer ${token}`)
			.send({ id: post.id, message });
		expect(response.status).toBe(200);
		expect(response.body.comment.postId).toBe(post.id);
		expect(response.body.comment.userId).toBe(user.id);
		expect(response.body.comment.message).toBe(message);
		comment = response.body.comment;
	});
	// //
	// it('should fail to get posts by user id due to a non-existent post id & return a 500 code', async () => {
	// 	const response = await supertest(app)
	// 		.post('/api/post/user')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({
	// 			id: 1,
	// 			limit,
	// 		});
	// 	expect(response.status).toBe(500);
	// });
	// it('should fail to get posts by user id due to an invalid inputs & return a 400 code', async () => {
	// 	const response = await supertest(app)
	// 		.post('/api/post/user')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({
	// 			id: 'abc',
	// 			limit: 'ten',
	// 		});
	// 	expect(response.status).toBe(400);
	// });
	// it('should fail to get posts by user id due to a missing inputs & return a 400 code', async () => {
	// 	const response = await supertest(app)
	// 		.post('/api/post/user')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({});
	// 	expect(response.status).toBe(400);
	// });
	// it('should fail to get posts by user id due to a missing auth token & return a 401 code', async () => {
	// 	const response = await supertest(app)
	// 		.post('/api/post/user')
	// 		.set('Authorization', `Bearer`)
	// 		.send({ id: user.id, limit });
	// 	expect(response.status).toBe(401);
	// });
	// it('should get posts by user id & return a 200 code + correct post info', async () => {
	// 	const response = await supertest(app)
	// 		.post('/api/post/user')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({ id: user.id, limit });
	// 	expect(response.status).toBe(200);
	// 	expect(response.body.posts.length).toBeGreaterThan(0);
	// 	expect(response.body.posts.length).toBeLessThanOrEqual(limit);
	// 	expect(response.body.posts[0].userId).toBe(user.id);
	// });
	// //
	// it('should fail to get all posts due to an invalid inputs & return a 400 code', async () => {
	// 	const response = await supertest(app)
	// 		.post('/api/post/all')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({
	// 			limit: 'ten',
	// 		});
	// 	expect(response.status).toBe(400);
	// });
	// it('should fail to get all posts due to a missing inputs & return a 400 code', async () => {
	// 	const response = await supertest(app)
	// 		.post('/api/post/all')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({});
	// 	expect(response.status).toBe(400);
	// });
	// it('should fail to get all posts due to a missing auth token & return a 401 code', async () => {
	// 	const response = await supertest(app)
	// 		.post('/api/post/all')
	// 		.set('Authorization', `Bearer`)
	// 		.send({ limit });
	// 	expect(response.status).toBe(401);
	// });
	// it('should get all posts & return a 200 code + correct post info', async () => {
	// 	const response = await supertest(app)
	// 		.post('/api/post/all')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({ limit });
	// 	expect(response.status).toBe(200);
	// 	expect(response.body.posts.length).toBeGreaterThan(0);
	// 	expect(response.body.posts.length).toBeLessThanOrEqual(limit);
	// 	expect(response.body.posts[0].userId).toBe(user.id);
	// });
	// //
	// it('should fail to update a post due to a non-existent post id & return a 500 code', async () => {
	// 	const response = await supertest(app)
	// 		.put('/api/post')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({
	// 			id: 1,
	// 			caption: updatedCap,
	// 		});
	// 	expect(response.status).toBe(500);
	// });
	// it('should fail to update a post due to an invalid inputs & return a 400 code', async () => {
	// 	const response = await supertest(app)
	// 		.put('/api/post')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({
	// 			id: 'abc',
	// 			caption: null,
	// 		});
	// 	expect(response.status).toBe(400);
	// });
	// it('should fail to update a post due to a missing post id & return a 400 code', async () => {
	// 	const response = await supertest(app)
	// 		.put('/api/post')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({ caption: updatedCap });
	// 	expect(response.status).toBe(400);
	// });
	// it('should fail to update a post due to a missing auth token & return a 401 code', async () => {
	// 	const response = await supertest(app)
	// 		.put('/api/post')
	// 		.set('Authorization', `Bearer`)
	// 		.send({ id: post.id, caption: updatedCap });
	// 	expect(response.status).toBe(401);
	// });
	// it('should update a post & return a 200 code + correct post info', async () => {
	// 	const response = await supertest(app)
	// 		.put('/api/post')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({ id: post.id, caption: updatedCap });
	// 	expect(response.status).toBe(200);
	// 	expect(response.body.post.caption).toBe(updatedCap);
	// 	expect(response.body.post.id).toBe(post.id);
	// });
	// it('should update (revert) a post & return a 200 code + correct post info', async () => {
	// 	const response = await supertest(app)
	// 		.put('/api/post')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({ id: post.id, caption });
	// 	expect(response.status).toBe(200);
	// 	expect(response.body.post.caption).toBe(caption);
	// 	expect(response.body.post.id).toBe(post.id);
	// });
	// //
	// it('should fail to delete a post due to a non-existent post id & return a 500 code', async () => {
	// 	const response = await supertest(app)
	// 		.delete('/api/post')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({
	// 			id: 1,
	// 		});
	// 	expect(response.status).toBe(500);
	// });
	// it('should fail to delete a post due to an invalid post id & return a 400 code', async () => {
	// 	const response = await supertest(app)
	// 		.delete('/api/post')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({
	// 			id: 'abc',
	// 		});
	// 	expect(response.status).toBe(400);
	// });
	// it('should fail to delete a post due to a missing post id & return a 400 code', async () => {
	// 	const response = await supertest(app)
	// 		.delete('/api/post')
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.send({});
	// 	expect(response.status).toBe(400);
	// });
	// it('should fail to delete a post due to a missing auth token & return a 401 code', async () => {
	// 	const response = await supertest(app)
	// 		.delete('/api/post')
	// 		.set('Authorization', `Bearer`)
	// 		.send({ id: post.id });
	// 	expect(response.status).toBe(401);
	// });
	it('should delete a comment & return a 200 code + correct comment info', async () => {
		const response = await supertest(app)
			.delete('/api/comment')
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: comment.id,
			});
		expect(response.status).toBe(200);
		expect(response.body.comment.id).toBe(comment.id);
		expect(response.body.comment.message).toBe(comment.message);
		expect(response.body.comment.userId).toBe(comment.userId);
		expect(response.body.comment.postId).toBe(comment.postId);
	});
	it('should delete a post & return a 200 code + correct post info', async () => {
		const response = await supertest(app)
			.delete('/api/post')
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: post.id,
			});
		expect(response.status).toBe(200);
		expect(response.body.post.id).toBe(post.id);
		expect(response.body.post.caption).toBe(post.caption);
		expect(response.body.post.image).toMatch(urlPattern);
	});
	//
	it('should delete the user & return a 200 code + correct user info', async () => {
		const response = await supertest(app)
			.delete('/api/user')
			.set('Authorization', `Bearer ${token}`);
		expect(response.status).toBe(200);
		expect(response.body.user.id).toBe(user.id);
	});
});
