import { db, auth } from "./firebase.js"
import { 
    doc,
    collection,
    setDoc,
    deleteDoc,
    getDocs,
    limit,
    query,
    orderBy,
    getDoc,
    updateDoc
} from "firebase/firestore"
import { addNotification } from "./notifications.js"

// Helper functions for db
const getUsersRef = () => collection(db, 'users')
const getUserRef = (userId) => doc(getUsersRef(), userId)
const getPostsRef = (userId) => collection(getUserRef(userId), 'posts')
const getPostRef = (userId, postId) => doc(getPostsRef(userId), postId)
const getCommentsRef = (userId, postId) => collection(getPostRef(userId, postId), 'comments')
const getCommentRef = (userId, postId, commentId=null) => {
    if (commentId != null) {
        return doc(getCommentsRef(userId, postId), commentId)
    } else {
        return doc(getCommentsRef(userId, postId))
    }
}

// Create new comment & return comment ID
const newComment = async (postId, postOwnerId, text) => {
    // First, set up comment data
    const userId = auth.currentUser.uid
    const commentData = {
        post: postId,
        date: Date.now(),
        user: userId,
        postOwner: postOwnerId,
        text: text
    }
    // Second, add comment to post's subcollection & assing new comment id to variable
    const commentId = await addCommentToUserPost(commentData, postId, postOwnerId)
    // Third, add notification to post owner's subcollection
    await addNotification('comment', postOwnerId)
    // Fourth, change post's comment count
    await changeCommentCount(postId, postOwnerId, true)
    // Fifth, return comment id
    return commentId
}

// Add comment to post in user's subcollection of posts & return id
const addCommentToUserPost = async (data, postId, postOwnerId) => {
    const commentRef = getCommentRef(postOwnerId, postId)
    await setDoc(commentRef, data)
    return commentRef.id
}

// Remove comment 
const removeComment = async (commentId, postId, postOwnerId) => {
    // First, change post's comment count
    await changeCommentCount(postId, postOwnerId, false)
    // Second, delete comment
    const commentRef = getCommentRef(postOwnerId, postId, commentId)
    await deleteDoc(commentRef)
}

// Get comments
const getComments = async (postId, postOwnerId, quantity) => {
    const commentsRef = getCommentsRef(postOwnerId, postId)
    const commentsQuery = query(commentsRef, orderBy("date", "desc"), limit(quantity))
    const commentsDocs = await getDocs(commentsQuery)
    const comments = commentsDocs.docs.map((doc) => {
        return {
            id: doc.id,
            data: doc.data()
        }
    })
    return comments
}

// Change comment count for post
const changeCommentCount = async (postOwnerId, postId, increase) => {
    // First, grab post ref
    const postRef = getPostRef(postOwnerId, postId)
    // Second, grab old comment count
    const postDoc = await getDoc(postRef)
    let commentCount = postDoc.data().comments
    // Third, increase or decrease like count
    if (increase == true) {
        commentCount += 1
    } else {
        commentCount -= 1
    }
    await updateDoc(postRef, {"comments": commentCount})
}

export { newComment, removeComment, getComments }