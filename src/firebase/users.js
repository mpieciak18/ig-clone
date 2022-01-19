// Firebase modules
import { db, auth } from "./firebase.js"
import { 
    doc,
    collection,
    setDoc,
    getDoc,
    updateDoc,
    query,
    where
} from "firebase/firestore"
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    signOut 
} from "firebase/auth"

// Register new user
const newUser = async (username, name, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        await addUser(user.email, user.uid, username, name)
        return null
    } catch(error) {
        return error
    }
}

// Add user to users collection
const addUser = async (username, name, email, id) => {
    const usersRef = collection(db, 'users')
    const newUserRef = doc(usersRef, id)
    const newUserData = {
        email: email, 
        username: username, 
        name: name, 
        image: '', 
        bio: '',
        followers: 0, 
        following: 0, 
        posts: 0
    }
    await setDoc(newUserRef, newUserData)
}

// Sign in user
const signInUser = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
        return null
    } catch(error) {
        return error
    }
}

// Sign out user
const signOutUser = async () => {
    await signOut(auth)
}

// Retrieve user
const findUser = async (userId) => {
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, userId)
    const userDoc = await getDoc(userRef)
    const user = {
        id: userDoc.id,
        data: userDoc.data()
    }
    return user
}

// Update user
const updateUser = async (name, username, bio) => {
    const userId = auth.currentUser.uid
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, userId)
    await updateDoc (userRef, {
        'name': name,
        'username': username,
        'bio': bio
    })
}

// Query for username & return true if it exists in db
const usernameExists = async (username) => {
    const usersRef = collection(db, 'users')
    const userRef = query(usersRef, where('username', '==', username))
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        return true
    } else {
        return false
    }
}

// Query for email & return true if it exists in db
const emailExists = async (email) => {
    const usersRef = collection(db, 'users')
    const userRef = query(usersRef, where('email', '==', email))
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
        return true
    } else {
        return false
    }
}

export { newUser, signInUser, signOutUser, findUser, updateUser, usernameExists, emailExists }