// Firebase modules
import { initializeApp } from "firebase/app"
import { 
    getFirestore,
    doc,
    collection,
    setDoc,
    getDoc,
    getDocs
} from "firebase/firestore"
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    signOut 
} from "firebase/auth"

// Firebase configuration settings
const firebaseConfig = {
    apiKey: "AIzaSyAJdE_RLKn6Y9YImHw5ZiOF-rdvQt5GIZk",
    authDomain: "ig-clone-5b7ab.firebaseapp.com",
    projectId: "ig-clone-5b7ab",
    storageBucket: "ig-clone-5b7ab.appspot.com",
    messagingSenderId: "183201976316",
    appId: "1:183201976316:web:29b1157645349379792c79"
}

// Firebase app initialization
const app = initializeApp(firebaseConfig)

// Firestore initialization
const db = getFirestore(app)

// Authentication initialization
const auth = getAuth(app) 

// Authenticate new user
const newUser = async (email, password, username, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        await addUser(user.email, user.uid, username, name)
    } catch(error) {
        // display error
    }
}

// Add user to users collection
const addUser = async (email, id, username, name) => {
    const usersRef = collection(db, 'users')
    const newUserRef = doc(usersRef, id)
    const newUserData = {email: email, username: username, name: name}
    await setDoc(newUserRef, newUserData)
}

// Sign in user
const signInUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
    } catch(error) {
        // display error
    }
}

// Sign out user
const signOutUser = async () => {
    await signOut()
}

// Retrieve user
const findUser = async (id) => {
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, id)
    const userDoc = await getDoc(userRef)
    const user = {
        id: userDoc.id,
        data: userDoc.data()
    }
    return user
}

// Retrieve one post, all posts from posts, all posts from everyone

// Retrieve single post
const findSinglePost = async (id) => {
    const postsRef = collection(db, 'posts')
    const postRef = doc(postsRef, id)
    const postDoc = await getDoc(postRef)
    const post = {
        id: postDoc.id,
        data: postDoc.data()
    }
    return post
}

// Retrieve all posts
const findAllPosts = async () => {
    const postsRef = collection(db, 'posts')
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

// Retrieve all posts from user
const findAllPostsFromUser = async (id) => {
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, id)
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
    const user = auth.currentUser
    const userId = user.uid
    const postData = {
        text: text,
        image: image,
        date: date,
        user: userId
    }
    const postId = await addPostToPosts(postData)
    postData.postId = postId
    await addPostToUserPostsCollection(postData)
    return postId
}

// Add post to posts collection in db & return post id
const addPostToPosts = async (data) => {
    const postsRef = collection(db, 'posts')
    const postRef = doc(postsRef)
    await setDoc(postRef, data)
    return postRef.id
}

// Add post to posts subcollection in user doc
const addPostToUserPostsCollection = async (data) => {
    const userId = data.user
    const postId = data.postId
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, userId)
    const postsRef = collection(userRef, 'posts')
    const postRef = doc(postsRef, postId)
    setDoc(postRef, data)
}

// Add, edit, remove post

// Add, edit, remove comment

// Add, remove like

// Add new DM, retrieve all DMs

export default { newUser, signInUser, signOutUser, newPost }