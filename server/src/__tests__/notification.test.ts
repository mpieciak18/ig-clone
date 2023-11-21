import supertest from 'supertest';
import app from '../server';
import { it, describe, expect } from 'vitest';

const urlPattern = /^(http|https):\/\/[^ "]+$/;

describe('/api/notification', () => {
	let token;
	let otherToken;
	let notification;
	const user = {
		email: 'test888@test3888.com',
		username: 'test3888',
		password: '123_abc',
		name: 'Tester',
		id: undefined,
	};
	const otherUser = {
		email: 'test999@test999.com',
		username: 'test999',
		password: '456_dfe',
		name: 'TESTER',
		id: undefined,
	};
	let post;
	it('should create both users + a post, get web tokens, user ids, & a 200 statuses', async () => {
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
		// // //
		const caption = 'this is a test';
		const response3 = await supertest(app)
			.post('/api/post')
			.set('Authorization', `Bearer ${otherToken}`)
			.set('Content-Type', 'multipart/form-data')
			.field('caption', caption)
			.attach('file', './src/__tests__/test.png');
		post = response3.body.post;
		expect(response3.status).toBe(200);
		expect(post?.userId).toBe(otherUser.id);
		expect(post?.caption).toBe(caption);
		expect(post?.image).toMatch(urlPattern);
	});
	//
	it('should fail to create a notification due to an invalid / missing inputs & return a 400 error', async () => {
		const response = await supertest(app)
			.post('/api/notification')
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: otherUser.id,
				// type: 'post',
				postId: 'this is an error',
			});
		expect(response.status).toBe(400);
	});
	it('should fail to create a notification due to no auth token & return a 401 error', async () => {
		const response = await supertest(app)
			.post('/api/notification')
			.set('Authorization', `Bearer`)
			.send({
				id: otherUser.id,
				type: 'post',
				postId: post.id,
			});
		expect(response.status).toBe(401);
	});
	it('should fail to create a notification due to a non-existent other user & return a 500 error', async () => {
		const response = await supertest(app)
			.post('/api/notification')
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: 1,
				type: 'post',
				postId: post.id,
			});
		expect(response.status).toBe(500);
	});
	it('should create a notification & return a 200 code + correct notification info', async () => {
		const response = await supertest(app)
			.post('/api/notification')
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: otherUser.id,
				type: 'post',
				postId: post.id,
			});
		notification = response.body.notification;
		expect(response.status).toBe(200);
		expect(response.body.notification.userId).toBe(otherUser.id);
		expect(response.body.notification.otherUserId).toBe(user.id);
		expect(response.body.notification.type).toBe('post');
		expect(response.body.notification.read).toBeFalsy();
	});
	//
	it('should fail to find unread notifications due to no auth token & return a 401 error', async () => {
		const response = await supertest(app)
			.get('/api/notification/getNotifsUnread')
			.set('Authorization', `Bearer`);
		expect(response.status).toBe(401);
	});
	it('should find unread notifications & return a 200 error + correct notification info', async () => {
		const response = await supertest(app)
			.get('/api/notification/unread')
			.set('Authorization', `Bearer ${otherToken}`);
		expect(response.status).toBe(200);
		expect(response.body.notifications?.length).toBeGreaterThan(0);
		const newNotif = response.body.notifications[0];
		expect(newNotif.id).toEqual(notification.id);
	});
	//
	it('should fail to update notification due to an invalid input & return a 400 error', async () => {
		const response = await supertest(app)
			.put('/api/notification/read')
			.set('Authorization', `Bearer ${otherToken}`)
			.send({});
		expect(response.status).toBe(400);
	});
	it('should fail to update notification due to no auth token & return a 401 error', async () => {
		const response = await supertest(app)
			.put('/api/notification/read')
			.set('Authorization', `Bearer`)
			.send({
				id: notification.id,
			});
		expect(response.status).toBe(401);
	});
	it('should fail to update notification due to a non-existent id & return a 500 error', async () => {
		const response = await supertest(app)
			.put('/api/notification/read')
			.set('Authorization', `Bearer ${otherToken}`)
			.send({
				id: 0,
			});
		expect(response.status).toBe(500);
	});
	it('should update notification & return a 200 error + correct notification info', async () => {
		const response = await supertest(app)
			.put('/api/notification/read')
			.set('Authorization', `Bearer ${otherToken}`)
			.send({
				id: notification.id,
			});
		expect(response.status).toBe(200);
		const newNotif = response.body.notification;
		expect(newNotif.id).toEqual(notification.id);
		expect(newNotif.read).toBeTruthy();
		notification.read = newNotif.read;
	});
	//
	it('should fail to find read notifications due to no auth token & return a 401 error', async () => {
		const response = await supertest(app)
			.get('/api/notification/read')
			.set('Authorization', `Bearer`);
		expect(response.status).toBe(401);
	});
	it('should find read notifications & return a 200 error + correct notification info', async () => {
		const response = await supertest(app)
			.get('/api/notification/read')
			.set('Authorization', `Bearer ${otherToken}`);
		expect(response.status).toBe(200);
		expect(response.body.notifications?.length).toBeGreaterThan(0);
		const newNotif = response.body.notifications[0];
		expect(newNotif.id).toEqual(notification.id);
	});
	//
	it('should fail to delete a notification due to an invalid input & return a 400 error', async () => {
		const response = await supertest(app)
			.delete('/api/notification')
			.set('Authorization', `Bearer ${otherToken}`)
			.send({});
		expect(response.status).toBe(400);
	});
	it('should fail to delete a notification due to no auth token & return a 401 error', async () => {
		const response = await supertest(app).delete('/api/notification').send({
			id: notification.id,
		});
		expect(response.status).toBe(401);
	});
	it('should fail to delete a follow notification to a non-existent notification id & return a 500 error', async () => {
		const response = await supertest(app)
			.delete('/api/notification')
			.set('Authorization', `Bearer ${otherToken}`)
			.send({
				id: 0,
			});
		expect(response.status).toBe(500);
	});
	it('should delete a notification & return a 200 error + correct notification info', async () => {
		const response = await supertest(app)
			.delete('/api/notification')
			.set('Authorization', `Bearer ${otherToken}`)
			.send({
				id: notification.id,
			});
		expect(response.status).toBe(200);
		expect(response.body.notification.id).toBe(notification.id);
		await supertest(app)
			.delete('/api/post')
			.set('Authorization', `Bearer ${otherToken}`)
			.send({
				id: post.id,
			});
		await supertest(app)
			.delete('/api/user')
			.set('Authorization', `Bearer ${token}`);
		await supertest(app)
			.delete('/api/user')
			.set('Authorization', `Bearer ${otherToken}`);
	});
});
