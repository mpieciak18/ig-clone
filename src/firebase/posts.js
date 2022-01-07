import { auth, db } from "./firebase.js"
import { 
    doc,
    collection,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    collectionGroup,
    query
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
const findAllPosts = async () => {
    const postsQuery = query(collectionGroup(db, 'posts'))
    const postsQueryDocs = await getDocs(postsQuery)
    let posts = []
    postsQueryDocs.forEach((doc) => {
        const post = {
            id: doc.id,
            data: doc.data()
        }
        posts = [...posts, post]
    })
    posts.sort((a, b) => {
        return a.localeCompare(b)
    })
    return posts
}

// Retrieve all posts from user
const findAllPostsFromUser = async (userId) => {
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, userId)
    const postsRef = collection(userRef, 'posts')
    const postDocs = await getDocs(postsRef)
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
        user: userId
    }
    const postId = await addPostToUserPostsCollection(postData)
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

// Remove post from user's subcollection of posts
const removePost = async (postId, userId) => {
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, userId)
    const userPostsRef = collection(userRef, 'posts')
    const userPostRef = doc(userPostsRef, postId)
    await deleteDoc(userPostRef)
}

export default { findAllPosts, findAllPostsFromUser, findSinglePost, newPost, removePost }