// Firebase modules
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

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

// Add, login, logout user

// Retrieve one post, all posts from posts, all posts from everyone

// Add, edit, remove post

// Add, edit, remove comment

// Add, remove like

// Add new DM, retrieve all DMs