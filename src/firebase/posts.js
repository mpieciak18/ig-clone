import { auth, db } from "./firebase.js"
import { 
    doc,
    collection,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    collectionGroup,
    query,
    limit
} from "firebase/firestore"

// Retrieve single post
const findSinglePost = async (postId, userId) => {
    const usersRef = collection(db, 'users'),
    const userRef = doc(usersRef, userId),
    const postsRef = collection(userRef, 'posts')
    const postRef = doc(postsRef, postId)
    const postDoc = await getDoc(postRef)
    const post = {
        id: postDoc.id,
        data: postDoc.data()
    }
    return post
}

// Retrieve all posts
const findPosts = async (arrQuantity) => {
    const postsQuery = query(collectionGroup(db, 'posts'), limit(arrQuantity))
    const postsQueryDocs = await getDocs(postsQuery)
    let posts = []
    postsQueryDocs.forEach((doc) => {
        const post = {
            id: doc.id,
            data: doc.data()
        }
        posts = [...posts, post]
    })
    // posts.sort((a, b) => {
    //     return a.localeCompare(b)
    // })
    return posts
}

// Retrieve all posts from user
const findPostsFromUser = async (userId, arrQuantity) => {
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, userId)
    const postsRef = collection(userRef, 'posts')
    const postsQuery = query(postsRef, limit(arrQuantity))
    const postDocs = await getDocs(postsQuery)
    let posts = []
    postDocs.forEach((doc) => {
        const post = {
            id: doc.id,
            data: doc.data()
        }
        posts = [...posts, post]
    })
    return posts
}

// Create new post & return new post ID
const newPost = async (text, image, date) => {
    const userId = auth.currentUser.uid
    const postData = {
        text: text,
        image: image,
        date: date,
        user: userId,
        likes: 0
    }
    const postId = await addPostToUserPostsCollection(postData)
    await changePostCount(userId, true)
    return postId
}

// Add post to posts subcollection in user doc & return post ID
const addPostToUserPostsCollection = async (data) => {
    const userId = data.user
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, userId)
    const postsRef = collection(userRef, 'posts')
    const postRef = doc(postsRef)
    await setDoc(postRef, data)
    return postRef.id
}

// Change post count for  user
const changePostCount = async (userId, increase) => {
    // First, grab old post count
    const userRef = getUserRef(userId)
    const userDoc = await getDoc(userRef)
    let postCount = userDoc.data().posts
    // Second, increase or decrease follower count
    if (increase == true) {
        postCount += 1
    } else {
        postCount -= 1
    }
    // Third, assign new follower count to user doc
    await updateDoc(userRef, {"posts": postCount})
}

// Remove post from user's subcollection of posts
const removePost = async (postId, userId) => {
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, userId)
    const userPostsRef = collection(userRef, 'posts')
    const userPostRef = doc(userPostsRef, postId)
    await changePostCount(userId, false)
    await removeLikes(userPostRef)
    await removeComments(userPostRef)
    await deleteDoc(userPostRef)
}

// Remove all likes from a post
const removeLikes = async (postRef) => {
    const likesRef = collection(postRef, 'likes')
    const likesDocs = await getDocs(likesRef)
    likesDocs.forEach((like) => {
        await deleteDoc(like)
    })
}

// Remove all comments from a post
const removeComments = async (postRef) => {
    const commentsRef = collection(postRef, 'comments')
    const commentsDocs = await getDocs(commentsRef)
    commentsDocs.forEach((comment) => {
        await deleteDoc(comment)
    })
}

export { findPosts, findPostsFromUser, findSinglePost, newPost, removePost }