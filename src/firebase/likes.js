import { auth, db } from './firebase.js'
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

// Helper functions for database
const getUsersRef = () => {return collection(db, 'users')}
const getUserRef = (userId) => {return doc(getUsersRef(), userId)}
const getPostsRef = (userId) => {return collection(getUserRef(userId), 'posts')}
const getPostRef = (userId, postId) => {return doc(getPostsRef(userId), postId)}
const getLikesRef = (userId, postId) => {return collection(getPostRef(userId, postId), 'likes')}
const getLikeRef = (userId, postId, likeId=null) => {
    if (likeId != null) {
        return doc(getLikesRef(userId, postId), likeId)
    } else {
        return doc(getLikesRef(userId, postId))
    }
}

// Add like to users -> user -> posts -> post -> likes
// and return the like id
const addLike = async (postId, postOwnerId) => {
    // First, update post like count
    const postRef = getPostRef(postOwnerId, postId)
    await changeLikeCount(postRef, true)
    // Second, set up data
    const userId = auth.currentUser.uid
    const data = {
        post: postId,
        postOwner: postOwnerId,
        user: userId
    }
    // Third, add like to likes collection & return like id
    const likeRef = getLikeRef(postOwnerId, postId)
    await setDoc(likeRef, data)
    return likeRef.id
}

// Remove like from post in user -> posts -> post
const removeLike = (likeId, postId, postOwnerId) => {
    // First, update post like count
    const postRef = getPostRef(postOwnerId, postId)
    await changeLikeCount(postRef, false)
    // Second, remove like doc
    const likeRef = doc(collection(postRef, 'posts'), likeId)
    await deleteDoc(likeRef)
}

// Change like count on post doc
const changeLikeCount = async (postRef, increase) => {
    // First, grab old like count
    const postDoc = await getDoc(postRef)
    let likeCount = postDoc.data().likes
    // Second, increase or decrease like count
    if (increase == true) {
        likeCount += 1
    } else {
        likeCount -= 1
    }
    await updateDoc(postRef, {"likes": likeCount})
}

// Check if user liked post
const likeExists = async (postId, postOwnerId) => {
    const userId = auth.currentUser.uid
    const likesRef = getLikesRef(postOwnerId, postId)
    const likeRef = query(likesRef, where('user', '==', userId))
    const likeDoc = await getDoc(likeRef)
    if (likeDoc.exists() == true) {
        return likeDoc.id
    } else {
        return null
    }
}

export default { addLike, removeLike, changeLikeCount, likeExists }