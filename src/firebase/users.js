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
        console.log('user credential:')
        console.log(userCredential)
        const user = userCredential.user
        console.log('user:')
        console.log(user)
        await addUser(username, name, user.email, user.uid)
        console.log(null)
        return null
    } catch(error) {
        console.log(error)
        return error
    }
}

// Add user to users collection
const addUser = async (username, name, email, id) => {
    const usersRef = collection(db, 'users')
    console.log('usersRef:')
    console.log(usersRef)
    const newUserRef = doc(usersRef, id)
    console.log('newUserRef:')
    console.log(newUserRef)
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
    console.log(newUserData)
    const res = await setDoc(newUserRef, newUserData)
    console.log(res)
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