import '../styles/components/CurrentConvo.css'

const CurrentConvo = (props) => {
    const [user, componentClass, currentConvo, eventHandler] = props

    const sendNewMessage = () => {return eventHandler()}

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
            <form class="single-convo-message-bar">
                <input type="text" class="single-convo-message-bar-input" placeholder="Send a message..."></input>
                <button type="submit" class="single-convo-message-button" onClick={() => sendNewMessage}></button>
            </form>
        </div>
    )
}

export { currentConvo }