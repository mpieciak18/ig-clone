import { db, auth } from './firebase.js'
import { 
    doc,
    collection,
    deleteDoc,
    setDoc
} from 'firebase/firestore'

// Helper functions that return doc/collection refs from the db
const getUsersRef = () => {
    return collection(db, 'users')
}
const getUserRef = (userId) => {
    return doc(getUsersRef(), userId)
}
const getSavedPostsRef = (userId) => {
    return collection(getUserRef(userId), 'saved')
}
const getSavedPostRef = (userId, savedPostId=null) => {
    if (savedPostId != null) {
        return doc(getSavedPostsRef(userId), savedPostId)
    } else {
        return doc(getSavedPostsRef(userId))
    }
}

// Add saved post to user -> saved posts & return saved post doc id
const addSavedPost = async (otherUserId, postId) => {
    // First, grab saved post reference
    const userId = auth.currentUser.uid
    const savedPostRef = getSavedPostRef(userId)
    // Second, create saved post data
    const data = {postId: postId, postOwner: otherUserId}
    // Third, add doc with data to saved posts
    await setDoc(savedPostRef, data)
    // Fourth, return saved post doc id
    return savedPostRef.id
}

// Remove saved post from user -> saved posts
const removeSavedPost = async (savedPostId) => {
    // First, grab saved post reference
    const userId = auth.currentUser.uid
    const savedPostRef = getSavedPostRef(userId, savedPostId)
    // Second, delete saved post doc
    await deleteDoc(savedPostRef)
}

export { addSavedPost, removeSavedPost }