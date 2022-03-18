// Firebase modules
import { db, auth } from "./firebase.js"
import { 
    doc,
    collection,
    setDoc,
    getDocs,
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
        await addUser(username, name, user.email, user.uid)
        return user.uid
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
        image: 'no-profile.png', 
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
        const signInObj = await signInWithEmailAndPassword(auth, email, password)
        return signInObj.user.uid
    } catch (error) {
        return null
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
const updateUser = async (image, name, bio) => {
    const userId = auth.currentUser.uid
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, userId)
    await updateDoc (userRef, {
        'image': image,
        'name': name,
        'bio': bio
    })
}

// Query for username & return true if it exists in db
const usernameExists = async (username) => {
    const usersRef = collection(db, 'users')
    const userQuery = query(usersRef, where('username', '==', username))
    const userDoc = await getDocs(userQuery)
    if (userDoc.empty != true) {
        return true
    } else {
        return false
    }
}

// Query for email & return true if it exists in db
const emailExists = async (email) => {
    const usersRef = collection(db, 'users')
    const userQuery = query(usersRef, where('email', '==', email))
    const userDoc = await getDocs(userQuery)
    if (userDoc.empty != true) {
        return true
    } else {
        return false
    }
}

export { newUser, signInUser, signOutUser, findUser, updateUser, usernameExists, emailExists }