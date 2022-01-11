import { db, auth } from './firebase.js'
import { 
    doc,
    collection,
    setDoc,
    getDoc,
    getDocs,
    query,
    limit
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

// Send message, add to both users (user -> conversation -> message),
// and return message id
const sendMessage = async (message, date, recipientId) => {
    // First, add message to sender's subcollection
    const senderId = auth.currentUser.uid
    const senderMessageRef = getMessageRef(senderId)
    const messageData = {
        sender: senderId,
        recipient: recipientId,
        date: date,
        message: message
    }
    await setDoc(senderMessageRef, messageData)
    // Second, add message to recipient's subcollection
    const messageId = senderMessageRef.id
    const recipMessageRef = getMessageRef(recipientId, messageId)
    await setDoc(recipMessageRef, messageData)
    // Third, return message id
    return messageId
}

// Retrieve single conversation & return array of message objects
const retrieveSingleConvo = async (otherUserId) => {
    const userId = auth.currentUser.uid
    const messagesRef = getMessagesRef(userId, otherUserId)
    const messageDocs = await getDocs(messagesRef)
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
// NOTE: the other user's ID is the conversation ID for the user
// and the user's ID is the conversation ID for the other user
const retrieveLatestMessage = async (otherUserId) => {
    const userId = auth.currentUser.id
    const messageRef = getMessagesRef(userId, otherUserId, true)
    const messageDoc = await getDoc(messageRef)
    const message = {
        id: messageDoc.id,
        data: messageDoc.data()
    }
    return message
}

// Retrieve all conversations and return array of objects containing
// the convo id, the convo data, and the latest message as properties
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
    return convos
}

export default { sendMessage, retrieveAllConvos, retrieveSingleConvo, retrieveLatestMessage }