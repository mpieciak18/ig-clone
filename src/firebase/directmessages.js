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
    orderBy
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
const getMessagesRef = (userId, otherUserId, limitOne=false) => {
    if (limitOne == false) {
        return collection(getConvoRef(userId, otherUserId), 'messages')
    } else {
        return query((getConvoRef(userId, otherUserId), 'messages'), limit(1))
    }
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
    // First, add message to sender's subcollection
    const userId = auth.currentUser.uid
    const senderMessageRef = getMessageRef(userId, otherUserId)
    const messageData = {
        sender: userId,
        recipient: otherUserId,
        date: Date.now(),
        message: message
    }
    await setDoc(senderMessageRef, messageData)
    // Second, add message to recipient's subcollection
    const messageId = senderMessageRef.id
    const recipMessageRef = getMessageRef(otherUserId, userId, messageId)
    await setDoc(recipMessageRef, messageData)
    // Third, add notification to recipient's subcollection
    await addNotification('message', otherUserId)
    // Fourth, return message id
    return messageId
}

// Retrieve single conversation & return array of message objects
const retrieveSingleConvo = async (otherUserId) => {
    const userId = auth.currentUser.uid
    const messagesRef = getMessagesRef(userId, otherUserId)
    const messagesQuery = query(messagesRef, orderBy("date", "desc"))
    const messageDocs = await getDocs(messagesQuery)
    let messages = []
    messageDocs.forEach((doc) => {
        const message = {
            id: doc.id,
            data: doc.data()
        }
        messages = [...messages, message]
    })
    return messages
}

// Retrieve latest message from a conversation
// NOTE: user A's ID is the convo ID for user B & vice-versa
const retrieveLatestMessage = async (otherUserId) => {
    const userId = auth.currentUser.id
    const messagesRef = getMessagesRef(userId, otherUserId, true)
    const singleMessageRef = query(messagesRef, orderBy("date", "desc"), limit(1))
    const messageDoc = await getDoc(singleMessageRef)
    const message = {
        id: messageDoc.id,
        data: messageDoc.data()
    }
    return message
}

// Retrieve all conversations
const retrieveAllConvos = async () => {
    const userId = auth.currentUser.id
    const convosRef = getConvosRef(userId)
    const convoDocs = await getDocs(convosRef)
    let convos = []
    convoDocs.forEach((doc) => {
        const convo = {
            id: doc.id,
            lastMessage: await retrieveLatestMessage(doc.id)
        }
        convos = [...convos, convo]
    })
    convos.sort((a, b) => {
        return b.lastMessage.date - a.lastMessage.date
    })
    return convos
}

export default { sendMessage, retrieveAllConvos, retrieveSingleConvo, retrieveLatestMessage }