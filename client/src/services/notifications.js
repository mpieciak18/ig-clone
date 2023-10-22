import { 
    collection,
    doc, 
    setDoc, 
    getDocs, 
    limit, 
    where,
    query,
    orderBy,
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
// Triggers/types include new like, new comment, new follow, and new message
const addNotification = async (type, otherUserId, postId=null) => {
    const selfId = auth.currentUser.uid
    const notifRef = findNotification(otherUserId)
    const notifData = {
        type: type,
        date: Date.now(),
        otherUser: selfId,
        post: postId,
        read: false
    }
    await setDoc(notifRef, notifData)
}

// Retrieve logged-in user's new notifcations
const getNewNotifications = async (quantity) => {
    const userId = auth.currentUser.uid
    const notifCollection = findNotifications(userId)
    const notifQuery = await getDocs(notifCollection)
    const notifDocs = notifQuery.docs
    // Get unread notifications
    const filteredDocs = notifDocs.filter(doc => doc.data().read == false)
    // Return null if there are no unread notificaiton
    if (filteredDocs.length == 0) {
        return null
    } else {
        // Extract data from filteredDocs
        const filteredArr = filteredDocs.map(doc => {
            return {id: doc.id, data: doc.data()}
        })
        // Sort notifications by date
        filteredArr.sort((a, b) => {
            return b.data.date - a.data.date
        })
        // Account for quantity parameter
        if (filteredArr.length < quantity) {
            return filteredArr
        } else {
            return filteredArr.slice(0, quantity)
        }
    }
}

// Retrieve logged-in user's old notifcations
const getOldNotifications = async (quantity) => {
    const userId = auth.currentUser.uid
    const notifCollection = findNotifications(userId)
    const notifQuery = await getDocs(notifCollection)
    const notifDocs = notifQuery.docs
    // Get unread notifications
    const filteredDocs = notifDocs.filter(doc => doc.data().read == true)
    // Return null if there are no unread notificaiton
    if (filteredDocs.length == 0) {
        return null
    } else {
        // Extract data from filteredDocs
        const filteredArr = filteredDocs.map(doc => {
            return {id: doc.id, data: doc.data()}
        })
        // Sort notifications by date
        filteredArr.sort((a, b) => {
            return b.data.date - a.data.date
        })
        // Account for quantity parameter
        if (filteredArr.length < quantity) {
            return filteredArr
        } else {
            return filteredArr.slice(0, quantity)
        }
    }
}

// Mark logged-in user's notifications as read
const readNotifications = async () => {
    const userId = auth.currentUser.uid
    const notifCollection = findNotifications(userId)
    const notifQuery = await getDocs(notifCollection)
    const notifDocs = notifQuery.docs
    // Get unread notifications
    const filteredDocs = notifDocs.filter(doc => doc.data().read == false)
    // Return null if there are no unread notificaiton
    if (filteredDocs.length == 0) {
        return null
    } else {
        filteredDocs.forEach(async (doc) => {
            const notifRef = findNotification(userId, doc.id)
            await updateDoc(notifRef, {"read": true})
        })
    }
}

export { addNotification, getNewNotifications, getOldNotifications, readNotifications }