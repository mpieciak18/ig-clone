// Firebase modules
import { initializeApp } from "firebase/app"
import { 
    getFirestore,
    doc,
    collection,
    setDoc
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
const newUser = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password)
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        await addUser(userCredential.user)
    } catch(error) {
        // display error
    }
}

// Add user to users collection
const addUser = async (user) => {
    const usersRef = collection(db, 'users')

    const id = user.uid
    const email = user.email
    const newUserRef = doc(usersRef, id)
    const newUserData = {email: email}

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

// Retrieve one post, all posts from posts, all posts from everyone

// Add, edit, remove post
const addPost = async () => {

}

// Add, edit, remove comment

// Add, remove like

// Add new DM, retrieve all DMs

export default { newUser, signInUser, signOutUser }