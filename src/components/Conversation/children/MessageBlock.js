import { timeSince } from '../../../other/timeSince.js'

const MessageBlock = async (props) => {
    const { user, messageData } = props
    const userId = user.id
    const senderId = messageData.sender

    let messageClass
    if (userId == senderId) {
        messageClass = 'message-block self'
    } else {
        messageClass = 'message-block other'
    }

    const time = timeSince(messageData.date)

    return (
        <div className={messageClass}>
            <div className='message-block-message'>{messageData.message}</div>
            <div className='message-block-time'>{time}</div>
        </div>
    )
}

export { MessageBlock }