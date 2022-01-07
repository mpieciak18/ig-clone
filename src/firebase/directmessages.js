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

// Send message, add to both users (user -> conversation -> message),
// and return message id
// NOTE: the conversation id is the OTHER user's id (and vice versa in their convos)
const sendMessage = async (message, date, recipientId) => {
    // First, add message to sender's subcollection
    const senderId = auth.currentUser.uid
    const senderMessageRef = getMessageRef(senderId, recipientId)
    const messageData = {
        sender: senderId,
        recipient: recipientId,
        date: date,
        message: message
    }
    await setDoc(senderMessageRef, messageData)
    // Second, add message to recipient's subcollection
    const messageId = senderMessageRef.id
    const recipMessageRef = getMessageRef(recipientId, userId, messageId)
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
    const userId = auth.currentUser.uid
    const convoRef = getConvoRef(userId, otherUserId)
    const messageRef = query(convoRef, limit(1))
    const messageDoc = await getDoc(messageRef)
    const message = {
        id: messageDoc.id,
        data: messageDoc.data()
    }
    return message
}

export default { sendMessage, retrieveLatestMessage }