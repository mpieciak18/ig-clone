import '../styles/components/Messages/CurrentConvo.css'
import { sendMessage } from '../firebase/directmessages.js'
import { ConvoMessageBlock } from '../components/ConvoPreview.js'

const CurrentConvo = (props) => {
    const { user, componentClass, currentConvo, viewAllConvos } = props

    // Add new message to specific convo in db
    const sendNewMessage = async (event) => {
        event.preventDefault()
        const comment = event.target.message
        const otherUserId = currConvo.otherUserId
        await sendMessage(comment, otherUserId)
    }

    return (
        <div id="single-convo" class={componentClass}>
            <div id="single-convo-back-button" onClick={viewAllConvos}>
                <div id='single-convo-back-arrow'>⇽</div>
                <div id='single-convo-back-text'>Back to Messages</div>
            </div>
            <div id="single-convo-messages">
                {currentConvo.messages.map((message) => {
                    return (
                        <ConvoMessageBlock
                            user={user}
                            messageId={message.id}
                            messageData={message.data}
                        />
                    )
                })}
            </div>
            <form class="single-convo-message-bar" onSubmit={sendNewMessage}>
                <input type="text" name="message" class="single-convo-message-bar-input" placeholder="Send a message..." />
                <button type="submit" class="single-convo-message-button">
                    <img class="single-convo-message-button-icon" />
                </button>
            </form>
        </div>
    )
}

export { CurrentConvo }