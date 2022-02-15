import { db, auth } from './firebase.js'
import { 
    doc,
    collection,
    deleteDoc,
    setDoc,
    getDocs,
    query,
    limit,
    where
} from 'firebase/firestore'

// Helper functions that return doc/collection refs from the db
const getUsersRef = () => {
    return collection(db, 'users')
}
const getUserRef = () => {
    const userId = auth.currentUser.uid
    return doc(getUsersRef(), userId)
}
const getSavesRef = () => {
    return collection(getUserRef(), 'saves')
}
const getSaveRef = (saveId=null) => {
    if (saveId != null) {
        return doc(getSavesRef(), saveId)
    } else {
        return doc(getSavesRef())
    }
}

// Add saved post to user -> saved posts & return saved post doc id
const addSave = async (postId, postOwnerId) => {
    // First, grab saved post reference
    const saveRef = getSaveRef()
    // Second, create saved post data
    const data = {postId: postId, postOwner: postOwnerId}
    // Third, add doc with data to saved posts
    await setDoc(saveRef, data)
    // Fourth, return saved post doc id
    return saveRef.id
}

// Remove saved post from user -> saves
const removeSave = async (saveId) => {
    // First, grab saved post reference
    const saveRef = getSaveRef(saveId)
    // Second, delete saved post doc
    await deleteDoc(saveRef)
}

// Retrieve all saved posts
const findSaves = async (arrQuantity) => {
    const savesRef = getSavesRef()
    const savesQuery = query(savesRef, limit(arrQuantity))
    const savesQueryDocs = await getDocs(savesQuery)
    let saves = []
    savesQueryDocs.forEach((doc) => {
        const save = {
            id: doc.id,
            data: doc.data()
        }
        saves = [...saves, save]
    })
    return saves
}

// Check if user saved post
const saveExists = async (postId) => {
    const savesRef = getSavesRef()
    const saveQuery = query(savesRef, where("postId", "==", postId))
    const saveDoc = await getDocs(saveQuery)
    if (saveDoc.empty != true) {
        return saveDoc.docs[0].id
    } else {
        return null
    }
}

export { addSave, removeSave, findSaves, saveExists }