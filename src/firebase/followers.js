import { auth, db } from './firebase.js'
import { 
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    getDoc
 } from 'firebase/firestore'

// Helper functions for adding / removing follows in database
const getUsersRef = () => {return collection(db, 'users')}
const getUserRef = (userId) => {return doc(getUsersRef(), userId)}
// Grabs other user's follower records
// other user -> followers -> follow record
const getOtherUserFollowersRef = (otherUserId) => {return collection(getUserRef(otherUserId), 'followers')}
const getOtherUserFollowerRef = (otherUserId, followId=null) => {
    if (followId != null) {
        return doc(getOtherUserFollowersRef(otherUserId), followId)
    } else {
        return doc(getOtherUserFollowersRef(otherUserId))
    }
}
// Grabs own user's following records
// self -> following -> follow record
const getOwnFollowsRef = (ownId) => {return collection(getUserRef(ownId), 'followers')}
const getOwnFollowRef = (ownId, followId=null) => {
    if (followId != null) {
        return doc(getOwnFollowsRef(ownId), followId)
    } else {
        return doc(getOwnFollowsRef(ownId))
    }
}

// Add follow to other user -> followers, then self -> following, and return the follow id
const addFollow = async (otherUserId) => {
    // First, increase other user follower count and self following count
    await changeOtherUserFollowerCount(otherUserId, true)
    const selfId = auth.currentUser.uid
    await changeSelfFollowingCount(selfId, true)
    // Second, set up data for otherUser -> follower
    // follower.self == other user; follower.otherUser == self
    const otherUserData = {
        self: otherUserId,
        otherUser: selfId
    }
    // Third, set up data for self -> following
    // follow.self == self; follow.otherUser == other user
    const selfData = {
        self: selfId,
        otherUser: otherUserId
    }
    // Forth, add new follower to otherUser -> followers
    const otherUserFollowerRef = getOtherUserFollowerRef(otherUserId)
    const followId = otherUserFollowerRef.id
    await setDoc(otherUserFollowerRef, otherUserData)
    // Fifth, add new follow to self -> following
    const selfFollowingRef = getOwnFollowRef(selfId, followId)
    await setDoc(selfFollowingRef, selfData)
    // Sixth, return follow/follower id
    return followId
}

// Remove follow from other user -> followers and self -> following
const removeFollow = (followId, otherUserId) => {
    // First, decrease other user follower count and self following count
    await changeOtherUserFollowerCount(otherUserId, false)
    const selfId = auth.currentUser.uid
    await changeSelfFollowingCount(selfId, false)
    // Second, remove follower from other -> followers
    const otherUserFollowerRef = getOtherUserFollowerRef(otherUserId, followId)
    await deleteDoc(otherUserFollowerRef)
    // Third, remove follow from self -> follower
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

export default { addFollow, removeFollow }