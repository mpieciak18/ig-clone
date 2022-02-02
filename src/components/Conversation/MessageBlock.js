import '../styles/components/Messages/ConvoMessageBlock.css'
import { findUser } from '../../firebase/users.js'
import { timeSince } from '../../other/timeSince.js'

const MessageBlock = async (props) => {
    const { user, messageData } = props
    const userId = user.id
    const senderId = messageData.sender

    let messageClass
    let iconSrc
    if (userId == senderId) {
        messageClass = 'message-block self'
        iconSrc = user.image
    } else {
        messageClass = 'message-block other'
        iconSrc = (await findUser(senderId)).data.image
    }

    const time = timeSince(messageData.date)

    return (
        <div className={messageClass}>
            <div className='message-block-icon'>
                {() => {
                    if (messageData.senderChange == true) {
                        return <img className='message-block-image' src={iconSrc} />
                    } else {
                        return null
                    }
                }}
            </div>
            <div className='message-block-message'>{messageData.message}</div>
            <div className='message-block-time'>{time}</div>
        </div>
    )
}

export { MessageBlock }