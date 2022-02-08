import { Navigate, useParams } from 'react-router-dom'
import './Conversation.css'
import { sendMessage, retrieveSingleConvo } from '../../firebase/messages.js'
import {MessageBlock} from './children/MessageBlock.js'

const Conversation = (props) => {
    const { user } = props

    // Grab other user's id from url parameters
    const { userId } = useParams()

    // Add new message to specific convo in db
    const sendNewMessage = async (event) => {
        event.preventDefault()
        const message = event.target.message
        if (message.length > 0) {
            await sendMessage(message, userId)
        }
    }

    // Redirect back to messages page
    const redirect = () => {
        return <Navigate to='/messages' />
    }

    // Retrieve all messages in conversation
    const messages = retrieveSingleConvo(userId)

    return (
        <div id="conversation" className='page'>
            <div id="convo-back-button" onClick={redirect}>
                <div id='convo-back-arrow'>⇽</div>
                <div id='convo-back-text'>Back to Messages</div>
            </div>
            <div id="convo-messages">
                {messages.map((message) => {
                    return (
                        <MessageBlock user={user} messageData={message.data} />
                    )
                })}
            </div>
            <form className="convo-message-bar" onSubmit={sendNewMessage}>
                <input type="text" name="message" className="convo-message-bar-input" placeholder="Send a message..." />
                <button type="submit" className="convo-message-button">
                    <img className="convo-message-button-icon" />
                </button>
            </form>
        </div>
    )
}

export { Conversation }