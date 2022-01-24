import {} from 'firebase/auth'
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { db, auth } from './firebase.js'

// Helper functions for getting firestore references
const findUsers = () => {
    return collection(db, 'users')
}
const findUser = () => {
    const userId = auth.currentUser.uid
    return doc(findUsers(), userId)
}
const findNotifications = () => {
    return collection(findUser(), 'notifications')
}
const findNotification = (notificationId=null) => {
    if (notificationId != null) {
        return doc(findNotifications(), notificationId)
    } else {
        return doc(findNotifications())
    }
}

// Add new notification
// Types include new like, new comment, new follow, and new DM
const addNotification = async (type, otherUserId, ) => {
    const notiRef = findNotification()
    let date
    const notiData = {
        type: type,
        date: date,
        otherUser = otherUserId
    }
    await setDoc(notiRef, notiData)
}

// Retrieve notifcations
// Returns array of objects, each containing notification id & data
const getNotifications = async () => {
    const notiCollection = findNotifications()
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

// Clear out notifications
const clearNotifications = async () => {
    const notiCollection = findNotifications()
    const notiDocs = await getDocs(notiCollection)
    notiDocs.forEach((notification) => {
        await deleteDoc(notification)
    })
}

export { addNotification, getNotifications, clearNotifications }