import { db, auth } from './firebase.js'
import { doc, collection, setDoc } from 'firebase/firestore'

// Send message, add to both users messages subcollections,
// and return message id
const sendMessage = async (message, date, recipientId) => {
    // First, add message to sender's subcollection
    const senderId = auth.currentUser.uid
    const usersRef = collection(db, 'users')
    const senderRef = doc(usersRef, senderId)
    const senderMessagesRef = collection(senderRef, 'messages')
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
    const recipientRef = doc(usersRef, recipientId)
    const recipientMessagesRef = collection(recipientRef, 'messages')
    const recipientMessageRef = doc(recipientMessagesRef, messageId)
    await setDoc(recipientMessageRef, messageData)
    // Third, return message id
    return messageId
}

export default { sendMessage }