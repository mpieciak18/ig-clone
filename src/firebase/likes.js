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
    where,
    limit,
    getDocs,
    QuerySnapshot
} from 'firebase/firestore'
import { findUser } from './users.js'

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

// Add like to post and return the like id
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
    // Fourth, add like to post
    const likeRef = getLikeRef(postOwnerId, postId)
    await setDoc(likeRef, data)
    // Fifth, add notification to recipient's subcollection
    await addNotification('like', postOwnerId)
    // Sixth, return like id
    return likeRef.id
}

// Remove like from post
const removeLike = async (likeId, postId, postOwnerId) => {
    // First, update post like count
    const postRef = getPostRef(postOwnerId, postId)
    await changeLikeCount(postRef, false)
    // Second, remove like doc
    const likeRef = doc(collection(postRef, 'likes'), likeId)
    await deleteDoc(likeRef)
}

// Change like count for post
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

// Check if user already liked post
const likeExists = async (postId, postOwnerId) => {
    const userId = auth.currentUser.uid
    const likesRef = getLikesRef(postOwnerId, postId)
    const likeRef = query(likesRef, where('user', '==', userId))
    const likeDoc = await getDocs(likeRef)
    if (likeDoc.empty == true) {
        return null
    } else {
        return likeDoc.docs[0].id
    }
}

// Retrieve all users who like a post
const getLikes = async (postId, postOwnerId, arrQuantity) => {
    const likesRef = getLikesRef(postOwnerId, postId)
    const likesQuery = query(likesRef, limit(arrQuantity))
    const likesDocs = await getDocs(likesQuery)
    return likesDocs.map(async (like) => {
        const user = await findUser(like.data.user)
        return user
    })
}

export { addLike, removeLike, changeLikeCount, likeExists, getLikes }