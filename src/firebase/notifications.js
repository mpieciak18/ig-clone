import { 
    collection,
    doc, 
    setDoc, 
    getDocs, 
    deleteDoc, 
    limit, 
    query,
    where,
    updateDoc
} from 'firebase/firestore'
import { db, auth } from './firebase.js'

// Helper functions for getting firestore references
const findUsers = () => {
    return collection(db, 'users')
}
const findUser = (userId) => {
    return doc(findUsers(), userId)
}
const findNotifications = (userId) => {
    return collection(findUser(userId), 'notifications')
}
const findNotification = (userId, notificationId=null) => {
    if (notificationId != null) {
        return doc(findNotifications(userId), notificationId)
    } else {
        return doc(findNotifications(userId))
    }
}

// Add new notification to other user when logged-in user performs a trigger
// Triggers/types include new like, new comment, new follow, and new DM
const addNotification = async (type, otherUserId, postId=null) => {
    const selfId = auth.currentUser.uid
    const notiRef = findNotification(otherUserId)
    const notiData = {
        type: type,
        date: Date.now(),
        otherUser: selfId,
        post: postId,
        read: false
    }
    await setDoc(notiRef, notiData)
}

// Retrieve logged-in user's notifcations
const getNotifications = async (quantity) => {
    const userId = auth.currentUser.uid
    const notiCollection = findNotifications(userId)
    const notiQuery = query(notiCollection, limit(quantity))
    const notiDocs = await getDocs(notiQuery)
    let notiArr = []
    notiDocs.forEach((doc) => {
        const notification = {
            id: doc.id,
            data: doc.data()
        }
        notiArr = [...notiArr, notification]
    })
    return notiArr
}

// Mark logged-in user's notifications as read
const readNotifications = async () => {
    const userId = auth.currentUser.uid
    const notiCollection = findNotifications(userId)
    const notiQuery = query(notiCollection, where("read", "==", true))
    const notiDocs = await getDocs(notiQuery)
    notiDocs.forEach((doc) => {
        await updateDoc(doc, {"read": true})
    })
}

export { addNotification, getNotifications, readNotifications }