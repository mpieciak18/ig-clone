import { auth, db } from './firebase.js'
import { addNotification } from './notifications.js'
import { 
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    getDoc,
    getDocs,
    query,
    limit,
    where
 } from 'firebase/firestore'

// Helper functions for adding / removing follows in database
const getUsersRef = () => collection(db, 'users')
const getUserRef = (userId) => doc(getUsersRef(), userId)
// Grabs user's follower subcollection
const getFollowersRef = (userId) => collection(getUserRef(userId), 'followers')
const getFollowerRef = (userId, followerId=null) => {
    if (followerId != null) {
        return doc(getFollowersRef(userId), followerId)
    } else {
        return doc(getFollowersRef(userId))
    }
}
// Grabs user's following subcollection
const getFollowingsRef = (userId) => {return collection(getUserRef(userId), 'following')}
const getFollowingRef = (userId, followingId=null) => {
    if (followingId != null) {
        return doc(getFollowingsRef(userId), followingId)
    } else {
        return doc(getFollowingsRef(userId))
    }
}

// Add follow to other user and self, then return the follow id
const addFollow = async (otherUserId) => {
    // First, increase other user follower count and self following count
    await changeOtherUserFollowerCount(otherUserId, true)
    const selfId = auth.currentUser.uid
    await changeSelfFollowingCount(selfId, true)
    // Second, set up data for otherUser -> follower
    const otherUserData = {
        self: otherUserId,
        otherUser: selfId
    }
    // Third, set up data for self -> following
    const selfData = {
        self: selfId,
        otherUser: otherUserId
    }
    // Forth, add new follower to other user
    const otherUserFollowerRef = getFollowerRef(otherUserId)
    const followId = otherUserFollowerRef.id
    await setDoc(otherUserFollowerRef, otherUserData)
    // Fifth, add new follow to self
    const selfFollowingRef = getFollowingRef(selfId, followId)
    await setDoc(selfFollowingRef, selfData)
    // Third, add notification to recipient's subcollection
    await addNotification('follow', otherUserId)
    // Seventh, return follow/follower id
    return followId
}

// Remove follow from other user and self
const removeFollow = async (followId, otherUserId) => {
    // First, decrease other user follower count and self following count
    await changeOtherUserFollowerCount(otherUserId, false)
    const selfId = auth.currentUser.uid
    await changeSelfFollowingCount(selfId, false)
    // Second, remove follower from other user
    const otherUserFollowerRef = getFollowerRef(otherUserId, followId)
    await deleteDoc(otherUserFollowerRef)
    // Third, remove follow from self
    const selfFollowingRef = getFollowingRef(selfId, followId)
    await deleteDoc(selfFollowingRef)
}

// Change follower count for other user
const changeOtherUserFollowerCount = async (otherUserId, increase) => {
    // First, grab old follower count
    const otherUserRef = getUserRef(otherUserId)
    const otherUserDoc = await getDoc(otherUserRef)
    let followerCount = otherUserDoc.data().followers
    // Second, increase or decrease follower count
    if (increase == true) {
        followerCount += 1
    } else {
        followerCount -= 1
    }
    // Third, assign new follower count to user doc
    await updateDoc(otherUserRef, {"followers": followerCount})
}

// Change following count for self
const changeSelfFollowingCount = async (selfId, increase) => {
    // First, grab old following count
    const selfRef = getUserRef(selfId)
    const selfDoc = await getDoc(selfRef)
    let followingCount = selfDoc.data().following
    // Second, increase or decrease follower count
    if (increase == true) {
        followingCount += 1
    } else {
        followingCount -= 1
    }
    // Third, assign new follower count to user doc
    await updateDoc(selfRef, {"following": followingCount})
}

// Check if the signed-in user is following another user
const checkForFollow = async (otherUserId) => {
    const userId = auth.currentUser.uid
    const followingsRef = getFollowingsRef(userId)
    const postRef = query(followingsRef, where("otherUser", "==", otherUserId))
    const postDocs = await getDocs(postRef)
    if (postDocs.empty == true) {
        return null
    } else {
        return postDocs.docs[0].id
    }
}

// Return array of user id's that given user follows
const getFollowing = async (userId, arrQuantity) => {
    const followingsRef = getFollowingsRef(userId, arrQuantity)
    const followingsQuery = query(followingsRef, limit(arrQuantity))
    const followingsDocs = await getDocs(followingsQuery)
    return followingsDocs.map(async (following) => {
        return await following.data().otherUser
    })
}

// Return array of user id's that follow the given user
const getFollowers = async (userId, arrQuantity) => {
    const followersRef = getFollowersRef(userId, arrQuantity)
    const followersQuery = query(followersRef, limit(arrQuantity))
    const followersDocs = await getDocs(followersQuery)
    return followersDocs.map(async (follower) => {
        return await follower.data().otherUser
    })
}

export { addFollow, removeFollow, checkForFollow, getFollowing, getFollowers }