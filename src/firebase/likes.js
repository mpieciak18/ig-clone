import { auth, db } from './firebase.js'
import { 
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc
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
    // First, set up data
    const userId = auth.currentUser.uid
    const data = {
        post: postId,
        postOwner: postOwnerId,
        user: userId
    }
    // Second, grab document reference
    const likeRef = getLikeRef(postOwnerId, postId)
    // Third, add like to likes collection & return like id
    await setDoc(likeRef, data)
    return likeRef.id
}

// Remove like from post in user -> posts -> post
const removeLike = (likeId, postId, postOwnerId) => {
    const likeRef = getLikeRef(postOwnerId, postId, likeId)
    await deleteDoc(likeRef)
}

export default { addLike, removeLike }