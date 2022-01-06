import { db, auth } from "./firebase.js"
import { 
    doc,
    collection,
    setDoc,
    deleteDoc
} from "firebase/firestore"

// Create new comment & return comment ID
const newComment = async (postId, date, postOwnerId) => {
    // First, set up comment data
    const user = await auth.currentUser
    const userId = user.uid
    const commentData = {
        post: postId,
        date: date,
        user: userId,
        postOwner: postOwnerId
    }
    // Second, add comment to db -> users -> posts -> comments
    // and assign the randomly generated comment id to a variable
    await addCommentToUserPost(commentData, postId)
    // Fourth, return comment id
    return commentId
}

// Add comment to post in user's subcollection of posts & return id
const addCommentToUserPost = async (data, postId, postOwnerId) => {
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, postOwnerId)
    const postsRef = collection(userRef, 'posts')
    const postRef = doc(postsRef, postId)
    const commentsRef = collection(postRef, 'comments')
    const commentRef = doc(commentsRef)
    await setDoc(commentRef, data)
    return commentRef.id
}

// Remove comment 
const removeComment = async (commentId, postId, postOwnerId) => {
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, postOwnerId)
    const postsRef = collection(userRef, 'posts')
    const postRef = doc(postsRef, postId)
    const commentsRef = collection(postRef, 'comments')
    const commentRef = doc(commentsRef, commentId)
    await deleteDoc(commentRef)
}

// Add, remove like

// Add new DM, retrieve all DMs

export default { newComment, removeComment }