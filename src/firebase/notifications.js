import {} from 'firebase/auth'
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore'
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

// Add new notification to user B when user A performs a trigger
// Triggers/types include new like, new comment, new follow, and new DM
const addNotification = async (type, otherUserId) => {
    const selfId = auth.currentUser.uid
    const notiRef = findNotification(otherUserId)
    let date
    const notiData = {
        type: type,
        date: date,
        otherUser: selfId
    }
    await setDoc(notiRef, notiData)
}

// Retrieve logged-in user's notifcations
// Returns array of objects, each containing notification id & data
const getNotifications = async () => {
    const userId = auth.currentUser.uid
    const notiCollection = findNotifications(userId)
    const notiDocs = await getDocs(notiCollection)
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

// Clear out logged-in user's notifications
const clearNotifications = async () => {
    const userId = auth.currentUser.uid
    const notiCollection = findNotifications(userId)
    const notiDocs = await getDocs(notiCollection)
    notiDocs.forEach((notification) => {
        await deleteDoc(notification)
    })
}

export { addNotification, getNotifications, clearNotifications }