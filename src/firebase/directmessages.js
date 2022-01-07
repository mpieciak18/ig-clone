import { db, auth } from './firebase.js'
import { doc, collection, setDoc } from 'firebase/firestore'

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

export default { sendMessage }