// Firebase modules
import { db, auth } from "./firebase.js"
import { 
    doc,
    collection,
    setDoc,
    getDoc,
    updateDoc
} from "firebase/firestore"
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    signOut 
} from "firebase/auth"

// Register new user
const newUser = async (email, password, username, name, image) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        await addUser(user.email, user.uid, username, name, image)
    } catch(error) {
        // return error
    }
}

// Add user to users collection
const addUser = async (email, id, username, name, image, bio) => {
    const usersRef = collection(db, 'users')
    const newUserRef = doc(usersRef, id)
    const newUserData = {
        email: email, 
        username: username, 
        name: name, 
        image: image, 
        bio: bio,
        followers: 0, 
        following: 0, 
        posts: 0
    }
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

export { newUser, signInUser, signOutUser, findUser, updateUser }