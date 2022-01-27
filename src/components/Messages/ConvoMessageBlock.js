import '../styles/components/Messages/ConvoMessageBlock.css'
import { findUser } from '../../firebase/users.js'
import { timeSince } from '../../other/timeSince'

const ConvoMessageBlock = async (props) => {
    const { user, messageId, messageData } = props
    const userId = user.id
    const senderId = messageData.sender


    let messageClass
    let iconSrc
    if (userId == senderId) {
        messageClass = 'convo-message-block self'
        iconSrc = user.image
    } else {
        messageClass = 'convo-message-block other'
        iconSrc = (await findUser(senderId)).data.image
    }

    const time = timeSince(messageData.date)

    return (
        <div className={messageClass}>
            <img className='convo-message-block-icon' src={iconSrc}></img>
            <div className='convo-message-block-message'>{messageData.message}</div>
            <div className='convo-message-block-time'>{time}</div>
        </div>
    )
}

export { ConvoMessageBlock }