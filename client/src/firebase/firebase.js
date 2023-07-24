// Firebase & React modules
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getStorage } from "firebase/storage"
import reactEventObserver from "react-event-observer"
import { firebaseKey } from "./api.js"

// Firebase configuration settings
const firebaseConfig = {
    apiKey: firebaseKey,
    authDomain: "ig-clone-5b7ab.firebaseapp.com",
    projectId: "ig-clone-5b7ab",
    storageBucket: "ig-clone-5b7ab.appspot.com",
    messagingSenderId: "183201976316",
    appId: "1:183201976316:web:29b1157645349379792c79",
    storageBucket: 'ig-clone-5b7ab.appspot.com'
}

// Firebase app initialization
const app = initializeApp(firebaseConfig)

// Firestore initialization
const db = getFirestore(app)

// Authentication initialization
const auth = getAuth(app)

// Storage initialization
const storage = getStorage(app)

// Init firebase observer
const firebaseObserver = reactEventObserver()

onAuthStateChanged(auth, (authUser) => {
    firebaseObserver.publish("authStateChanged", loggedIn())
})

const loggedIn = () => {
    return (auth.currentUser != null)
}

export { db, auth, storage, loggedIn, firebaseObserver }