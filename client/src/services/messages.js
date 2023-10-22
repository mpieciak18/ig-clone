import { db, auth } from './firebase.js'
import { addNotification } from './notifications.js'
import { 
    doc,
    collection,
    setDoc,
    getDoc,
    getDocs,
    query,
    limit,
    orderBy,
    updateDoc,
    onSnapshot
} from 'firebase/firestore'

// Helper functions that return doc/collection references from db
const getUsersRef = () => {
    return collection(db, 'users')
}
const getUserRef = (userId) => {
    return doc(getUsersRef(), userId)
}
const getConvosRef = (userId) => {
    return collection(getUserRef(userId), 'conversations')
}
const getConvoRef = (userId, otherUserId) => {
    return doc(getConvosRef(userId), otherUserId)
}
const getMessagesRef = (userId, otherUserId) => {
    return collection(getConvoRef(userId, otherUserId), 'messages')
}
const getMessageRef = (userId, otherUserId, messageId=null) => {
    if (messageId == null) {
        return doc(getMessagesRef(userId, otherUserId))
    } else {
        return doc(getMessagesRef(userId, otherUserId), messageId)
    }
}

// Send message from logged-in user to other user
// NOTE: user A's ID is the convo ID for user B & vice-versa
const sendMessage = async (message, otherUserId) => {
    const userId = auth.currentUser.uid
    // First, add convo docs to avoid "empty doc" error for new conversations
    await addConvos(userId, otherUserId)
    // First, determine if last message in convo was also sent by user
    let senderChange
    const lastMessage = await retrieveLatestMessage(otherUserId)
    if (lastMessage == null) {
        senderChange = true
    } else {
        senderChange = (lastMessage.data.sender != userId)
    }
    // Second, add message to sender's subcollection
    const senderMessageRef = getMessageRef(userId, otherUserId)
    const messageData = {
        sender: userId,
        recipient: otherUserId,
        date: Date.now(),
        message: message,
        senderChange: senderChange
    }
    await setDoc(senderMessageRef, messageData)
    // Third, add message to recipient's subcollection
    const messageId = senderMessageRef.id
    const recipMessageRef = getMessageRef(otherUserId, userId)
    await setDoc(recipMessageRef, messageData)
    // Fourth, add notification to recipient's subcollection
    await addNotification('message', otherUserId)
    // Sixth, update convo date fields
    await updateConvoDate(userId, otherUserId, messageData.date)
    // Seventh, return message object
    return {
        id: messageId,
        data: messageData
    }
}

// Add convo docs to both users
const addConvos = async (userId, otherUserId) => {
    const dummyDate = {date: ""}
    const ownConvoRef = getConvoRef(userId, otherUserId)
    const otherConvoRef = getConvoRef(otherUserId, userId)
    const ownConvoDoc = await getDoc(ownConvoRef)
    const otherConvoDoc = await getDoc(otherConvoRef)
    if (ownConvoDoc.exists() != true) {
        setDoc(ownConvoRef, dummyDate)
    }
    if (otherConvoDoc.exists() != true) {
        setDoc(otherConvoRef, dummyDate)
    }

}

// Update both users' convo date field
const updateConvoDate = async (userId, otherUserId, date) => {
    const ownConvoRef = getConvoRef(userId, otherUserId)
    const otherConvoRef = getConvoRef(otherUserId, userId)
    await updateDoc(ownConvoRef, {"date": date})
    await updateDoc(otherConvoRef, {"date": date})
}

// Retrieve single conversation & return array of message objects
const retrieveSingleConvo = async (otherUserId, quantity) => {
    const userId = auth.currentUser.uid
    const messagesRef = getMessagesRef(userId, otherUserId)
    const messagesQuery = query(messagesRef, orderBy("date", "desc"), limit(quantity))
    const messageDocs = await getDocs(messagesQuery)
    let messages = []
    messageDocs.forEach((doc) => {
        const message = {
            id: doc.id,
            data: doc.data()
        }
        messages = [message, ...messages]
    })
    return messages
}

// Add snapshot to single conversation
const convoSnapshot = async (otherUserId, updateState, quantity) => {
    const userId = auth.currentUser.uid
    const messagesRef = getMessagesRef(userId, otherUserId)
    onSnapshot(messagesRef, async () => {
        const messagesQuery = query(messagesRef, orderBy("date", "desc"), limit(quantity))
        const messageDocs = await getDocs(messagesQuery)
        let messages = []
        messageDocs.forEach((doc) => {
            const message = {
                id: doc.id,
                data: doc.data()
            }
            messages = [message, ...messages]
        })
        await updateState(messages)
    })
}

// Retrieve latest message from a conversation
// NOTE: user A's ID is the convo ID for user B & vice-versa
const retrieveLatestMessage = async (otherUserId) => {
    const userId = auth.currentUser.uid
    const messagesRef = getMessagesRef(userId, otherUserId)
    const singleMessageRef = query(messagesRef, orderBy("date", "desc"), limit(1))
    const messageDoc = (await getDocs(singleMessageRef)).docs[0]
    if (messageDoc == undefined) {
        return null
    } else {
        const message = {
            id: messageDoc.id,
            data: messageDoc.data()
        }
        return message
    }
}

// Retrieve all conversations
const retrieveConvos = async (quantity) => {
    const userId = auth.currentUser.uid
    const convosRef = getConvosRef(userId)
    const convosQuery = query(convosRef, orderBy("date", "desc"), limit(quantity))
    const convosDocs = await getDocs(convosQuery)
    const convos = (convosDocs.docs).map(async (doc) => {
        return {
            id: doc.id,
            lastMessage: await retrieveLatestMessage(doc.id)
        }
    })
    const results = await Promise.all(convos)
    return results
}

// Add snapshot to all conversation
const convosSnapshot = async (updateState, quantity) => {
    const userId = auth.currentUser.uid
    const convosRef = getConvosRef(userId)
    onSnapshot(convosRef, async () => {
        const convosQuery = query(convosRef, orderBy("date", "desc"), limit(quantity))
        const convosDocs = await getDocs(convosQuery)
        const convos = (convosDocs.docs).map(async (doc) => {
            return {
                id: doc.id,
                lastMessage: await retrieveLatestMessage(doc.id)
            }
        })
        const results = await Promise.all(convos)
        await updateState(results)
    })
}

export { sendMessage, retrieveConvos, retrieveSingleConvo, retrieveLatestMessage, convoSnapshot, convosSnapshot }