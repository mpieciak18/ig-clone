// Firebase & React modules
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase configuration settings
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_KEY,
	authDomain: 'ig-clone-5b7ab.firebaseapp.com',
	projectId: 'ig-clone-5b7ab',
	storageBucket: 'ig-clone-5b7ab.appspot.com',
	messagingSenderId: '183201976316',
	appId: '1:183201976316:web:29b1157645349379792c79',
	storageBucket: 'ig-clone-5b7ab.appspot.com',
};

// Firebase app initialization
const app = initializeApp(firebaseConfig);

// Storage initialization
const storage = getStorage(app);

export { db, auth, storage };
