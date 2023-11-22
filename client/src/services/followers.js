import { addNotification } from './notifications.js';

// Add new follow
export const addFollow = async (id) => {
	const response = await fetch(import.meta.env.VITE_API_URL + '/api/follow', {
		method: 'POST',
		body: { id },
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	if (response.status == 200) {
		// add notification to recipient
		await addNotification('follow', id);
		const json = await response.json();
		return json.follow;
	} else {
		throw new Error();
	}
};

// Remove follow from other user and self
const removeFollow = async (followId, otherUserId) => {
	// First, decrease other user follower count and self following count
	await changeOtherUserFollowerCount(otherUserId, false);
	const selfId = auth.currentUser.uid;
	await changeSelfFollowingCount(selfId, false);
	// Second, remove follower from other user
	const otherUserFollowerRef = getFollowerRef(otherUserId, followId);
	await deleteDoc(otherUserFollowerRef);
	// Third, remove follow from self
	const selfFollowingRef = getFollowingRef(selfId, followId);
	await deleteDoc(selfFollowingRef);
};

// Check if the signed-in user is following another user
const checkForFollow = async (otherUserId) => {
	const userId = auth.currentUser.uid;
	const followingsRef = getFollowingsRef(userId);
	const postRef = query(followingsRef, where('otherUser', '==', otherUserId));
	const postDocs = await getDocs(postRef);
	if (postDocs.empty == true) {
		return null;
	} else {
		return postDocs.docs[0].id;
	}
};

// Return array of user id's that given user follows
const getFollowing = async (userId, arrQuantity) => {
	const followingsRef = getFollowingsRef(userId, arrQuantity);
	const followingsQuery = query(followingsRef, limit(arrQuantity));
	const followingsDocs = await getDocs(followingsQuery);
	const followings = followingsDocs.docs.map((following) => {
		return {
			id: following.id,
			data: following.data(),
		};
	});
	return followings;
};

// Return array of user id's that follow the given user
const getFollowers = async (userId, arrQuantity) => {
	const followersRef = getFollowersRef(userId, arrQuantity);
	const followersQuery = query(followersRef, limit(arrQuantity));
	const followersDocs = await getDocs(followersQuery);
	const followers = followersDocs.docs.map((follower) => {
		return {
			id: follower.id,
			data: follower.data(),
		};
	});
	return followers;
};
