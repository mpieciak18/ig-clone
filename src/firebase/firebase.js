// Firebase & React modules
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { useEffect } from "react"

// Firebase configuration settings
const firebaseConfig = {
    apiKey: "AIzaSyAJdE_RLKn6Y9YImHw5ZiOF-rdvQt5GIZk",
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

// // Custom hook
// const useFirebaseAuthentication = (firebase) => {
//     const [user, setUser] = useState({
//         loggedIn: false,
//         id: '',
//         name: '',
//         username: '',
//         email: '', 
//         image: '',
//         followers: ''
//     })

//     useEffect(() =>{
//        const unlisten = onAuthStateChanged(
//           authUser => {
//             authUser
//               ? setAuthUser(authUser)
//               : setAuthUser(null);
//           },
//        );
//        return () => {
//            unlisten();
//        }
//     }, []);

//     return authUser
// }

// export default useFirebaseAuthentication;

export { db, auth, storage }