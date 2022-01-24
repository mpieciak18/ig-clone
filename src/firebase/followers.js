import { auth, db } from './firebase.js'
import { addNotification } from './notifications.js'
import { 
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    getDoc,
    query,
    where
 } from 'firebase/firestore'

// Helper functions for adding / removing follows in database
const getUsersRef = () => {return collection(db, 'users')}
const getUserRef = (userId) => {return doc(getUsersRef(), userId)}
// Grabs other user's follower subcollection
const getOtherUserFollowersRef = (otherUserId) => {return collection(getUserRef(otherUserId), 'followers')}
const getOtherUserFollowerRef = (otherUserId, followId=null) => {
    if (followId != null) {
        return doc(getOtherUserFollowersRef(otherUserId), followId)
    } else {
        return doc(getOtherUserFollowersRef(otherUserId))
    }
}
// Grabs own user's following subcollection
const getOwnFollowsRef = (ownId) => {return collection(getUserRef(ownId), 'followers')}
const getOwnFollowRef = (ownId, followId=null) => {
    if (followId != null) {
        return doc(getOwnFollowsRef(ownId), followId)
    } else {
        return doc(getOwnFollowsRef(ownId))
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
    const otherUserFollowerRef = getOtherUserFollowerRef(otherUserId)
    const followId = otherUserFollowerRef.id
    await setDoc(otherUserFollowerRef, otherUserData)
    // Fifth, add new follow to self
    const selfFollowingRef = getOwnFollowRef(selfId, followId)
    await setDoc(selfFollowingRef, selfData)
    // Third, add notification to recipient's subcollection
    await addNotification('follow', otherUserId)
    // Seventh, return follow/follower id
    return followId
}

// Remove follow from other user and self
const removeFollow = (followId, otherUserId) => {
    // First, decrease other user follower count and self following count
    await changeOtherUserFollowerCount(otherUserId, false)
    const selfId = auth.currentUser.uid
    await changeSelfFollowingCount(selfId, false)
    // Second, remove follower from other user
    const otherUserFollowerRef = getOtherUserFollowerRef(otherUserId, followId)
    await deleteDoc(otherUserFollowerRef)
    // Third, remove follow from self
    const selfFollowingRef = getOwnFollowRef(selfId, followId)
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
    await updateDoc(otherUserDoc, {"followers": followerCount})
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
    const followsRef = getOwnFollowsRef(userId)
    const postRef = query(followsRef, where("otherUser", "==", otherUserId))
    const postDoc = await getDoc(postRef)
    if (postDoc.exists()) {
        return true
    } else {
        return false
    }
}

export default { addFollow, removeFollow, checkForFollow }