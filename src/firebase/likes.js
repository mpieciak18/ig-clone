import { auth, db } from './firebase.js'
import { findUser } from './users.js'
import { 
    collection,
    doc,
    setDoc
 } from 'firebase/firestore'

// Add like to users -> user -> posts -> post -> likes
// and return the like id
const addLike = async (postId, postOwnerId) => {
    // First, set up data
    const userId = auth.currentUser
    const data = {
        post: postId,
        postOwner: postOwnerId,
        user: userId
    }
    // Second, grab document reference
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, postOwnerId)
    const postsRef = collection(userRef, 'posts')
    const postRef = doc(postsRef, postId)
    const likesRef = collection(postRef, 'likes')
    const likeRef = doc(likesRef)
    // Third, add like to likes collection & return like id
    await setDoc(likeRef, data)
    return likeRef.id
}

export default { addLike }