import { useState, useEffect } from "react"
import { getUrl } from "../../../firebase/storage.js"
import { timeSince } from '../../../other/timeSince.js'

const ConvoMessages = (props) => {

    const { user, otherUser, messagesArr } = props

    const [otherUserImg, setOtherUserImg] = useState(null)

    const [otherUserName, setOtherUserName] = useState(null)

    // Update image source on render
    useEffect(async () => {
        if (otherUser != null) {
            const otherUrl = await getUrl(otherUser.data.image)
            setOtherUserImg(otherUrl)
            const name = otherUser.data.name
            setOtherUserName(name)
        }
    }, [otherUser])

    const [messages, setMessages] = useState()

    // Update messages state when messagesArr changes
    useEffect(() => {
        if (messagesArr != null) {
            const newMessages = messagesArr.map((message) => {
                let sender

                if (user.id == message.data.sender) {
                    sender = 'self'
                } else {
                    sender = 'other'
                }

                let icon
                let name = null

                if (message.data.senderChange == true) {

                    if (sender == 'self') {
                        icon = <div className='message-block-icon' />
                        name = <div className='message-name'>You, {timeSince(message.data.date)}:</div>
                    } else {
                        icon = <img className='message-block-icon' src={otherUserImg} />
                        name = <div className='message-name'>{otherUserName}, {timeSince(message.data.date)}</div>
                    }
                }


                return (
                    <div className={`message-block-container ${sender}`} key={message.id}>
                        {name}
                        <div className='message-block'>
                            <div className='message-block-icon-container'>{icon}</div>
                            <div className='message-block-bubble'>
                                <div className='message-block-message'>{message.data.message}</div>
                            </div>
                        </div>
                    </div>
                )
            })

            setMessages(newMessages)
        }
    }, [messagesArr, otherUserImg, otherUserName])

    return (
        <div id='convo-messages'>
            {messages}
        </div>
    )
}

export { ConvoMessages }