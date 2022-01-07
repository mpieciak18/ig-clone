import { db, auth } from './firebase.js'
import { 
    doc,
    collection,
    setDoc,
    getDocs,
} from 'firebase/firestore'

// Send message, add to both users (user -> conversation -> message),
// and return message id
const sendMessage = async (message, date, recipientId) => {
    // First, add message to sender's subcollection
    const senderId = auth.currentUser.uid
    const usersRef = collection(db, 'users')
    const senderRef = doc(usersRef, senderId)
    const senderConvosRef = collection(senderRef, 'conversations')
    const senderConvoRef = doc(senderConvosRef, recipientId)
    const senderMessagesRef = collection(senderConvoRef, 'messages')
    const senderMessageRef = doc(senderMessagesRef)
    const messageData = {
        sender: senderId,
        recipient: recipientId,
        date: date,
        message: message
    }
    await setDoc(senderMessageRef, messageData)
    // Second, add message to recipient's subcollection
    const messageId = senderMessageRef.id
    const recipRef = doc(usersRef, recipientId)
    const recipConvosRef = collection(recipRef, 'conversations')
    const recipConvoRef = doc(recipConvosRef, senderId)
    const recipMessagesRef = collection(recipConvoRef, 'messages')
    const recipMessageRef = doc(recipMessagesRef, messageId)
    await setDoc(recipMessageRef, messageData)
    // Third, return message id
    return messageId
}

// Retrieve single conversation & return array of message objects
const retrieveSingleConvo = async (otherUserId) => {
    const userId = auth.currentUser.uid
    const usersRef = collection(db, 'users')
    const userRef = doc(usersRef, userId)
    const convosRef = collection(userRef, 'conversations')
    const convoRef = doc(convosRef, otherUserId)
    const messagesRef = collection(convoRef, 'messages')
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

export default { sendMessage }