import '../styles/components/CurrentConvo.css'
import { sendMessage } from '../firebase/directmessages.js'

const CurrentConvo = (props) => {
    const { user, componentClass, currentConvo } = props

    const sendNewMessage = async (event) => {
        event.preventDefault()
        const comment = event.target.message
        let date
        const otherUserId = currConvo.otherUserId
        await sendMessage(comment, date, otherUserId)
    }

    return (
        <div id="single-convo" class={componentClass}>
            <div id="single-convo-messages">
                {currentConvo.messages.map((message) => {
                    return (
                        <SingleMessageBlock
                            user={user}
                            messageId={message.id}
                            message={message.data}
                        />
                    )
                })}
            </div>
            <form class="single-convo-message-bar" onSubmit={() => sendNewMessage}>
                <input type="text" name="message" class="single-convo-message-bar-input" placeholder="Send a message..." />
                <button type="submit" class="single-convo-message-button">
                    <img class="single-convo-message-button-icon" />
                </button>
            </form>
        </div>
    )
}

export { CurrentConvo }