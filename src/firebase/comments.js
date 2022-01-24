import { db, auth } from "./firebase.js"
import { 
    doc,
    collection,
    setDoc,
    deleteDoc,
    getDocs,
    limit,
    query
} from "firebase/firestore"
import { addNotification } from "./notifications.js"

// Create new comment & return comment ID
const newComment = async (postId, postOwnerId, text) => {
    // First, set up comment data
    const userId = auth.currentUser.uid
    let currentDate
    const commentData = {
        post: postId,
        date: currentDate,
        user: userId,
        postOwner: postOwnerId,
        text: text
    }
    // Second, add comment to post's subcollection & assing new comment id to variable
    const commentId = await addCommentToUserPost(commentData, postId, postOwnerId)
    // Third, add notification to post owner's subcollection
    await addNotification('comment', postOwnerId)
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

// Get comments
const getComments = async (postId, postOwnerId, quantity) => {
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, postOwnerId)
    const postsRef = collection(userRef, 'posts')
    const postRef = doc(postsRef, postId)
    const commentsRef = collection(postRef, 'comments')
    const commentsQuery = query(commentsRef, limit(quantity))
    const commentsDocs = await getDocs(commentsQuery)
    let comments
    commentsDocs.forEach((doc) => {
        const comment = {
            id = doc.id,
            data = doc.data()
        }
        comments = [...comments, comment]
    })
    return comments
}

export default { newComment, removeComment, getComments }