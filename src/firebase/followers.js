import { auth, db } from './firebase.js'
import { 
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    getDoc
 } from 'firebase/firestore'

// Helper functions for database
const getUsersRef = () => {return collection(db, 'users')}
const getUserRef = (followedUserId) => {return doc(getUsersRef(), followedUserId)}
const getFollowersRef = (followedUserId) => {return collection(getUserRef(followedUserId), 'followers')}
const getFollowerRef = (followedUserId, followId=null) => {
    if (followId != null) {
        return doc(getFollowersRef(followedUserId), followId)
    } else {
        return doc(getFollowersRef(followedUserId))
    }
}

// Add follow to users -> user -> followers and return the follower id
const addFollow = async (followedUserId) => {
    // First, update user follower count
    await changeFollowerCount(followedUserId, true)
    // Second, set up data
    const followerId = auth.currentUser.uid
    const data = {
        followed: followedUserId,
        follower: followerId
    }
    // Third, add follow to followers collection & return follow id
    const followRef = getFollowerRef(followedUserId)
    await setDoc(followRef, data)
    return followRef.id
}

// Remove follow from users -> user -> followers
const removeFollow = (followId, followedUserId) => {
    // First, update user follower count
    await changeFollowerCount(followedUserId, false)
    // Second, remove follow doc
    const followRef = getFollowerRef(followedUserId, followId)
    await deleteDoc(followRef)
}

// Change follower count for user
const changeFollowerCount = async (followedUserId, increase) => {
    // First, grab old follower count
    const userRef = getUserRef(followedUserId)
    const userDoc = await getDoc(userRef)
    let followCount = userDoc.data().followers
    // Second, increase or decrease follower count
    if (increase == true) {
        followCount += 1
    } else {
        followCount -= 1
    }
    // Third, assign new follower count to user doc
    await updateDoc(userRef, {"followers": followCount})
}

export default { addFollow, removeFollow }