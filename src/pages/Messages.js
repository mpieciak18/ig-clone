import '../styles/Messages.css'
import {
    sendMessage,
    retrieveAllConvos,
    retrieveSingleConvo,
} from '../firebase/directmessages'
import { useState } from 'react'
import { Navbar } from '../components/Navbar.js'

const Messages = async (props) => {
    const [user] = props

    const [convos, setConvos] = useState(await retrieveAllConvos())

    const [currentConvo, setCurrentConvo] = useState(null)

    // The following React states determine mobile vs. desktop visibility
    const [allConvosClass, setAllConvosCall] = useState('visible')
    const [singleConvoClass, setSingleConvoClass] = useState('hidden')

    const viewAllConvos = () => {
        setAllConvosCall('visible')
        setSingleConvoClass('hidden')
    }
    const viewSingleConvo = async (event) => {
        const otherUserId = event.target.id
        setAllConvosCall('hidden')
        setSingleConvoClass('visible')
        const messages = await retrieveSingleConvo(otherUserId)
        setCurrentConvo({otherUserId: otherUserId, messages: messages})
    }

    const sendNewMessage = async (event) => {
        event.preventDefault()
        const message = document.getElementById('single-convo-message-bar-input').value
        let date
        const otherUserId = currentConvo.otherUserId
        await sendMessage(message, date, otherUserId)
    }

    const AllConvos = (
        <div id="all-convos" class={allConvosClass}>
            <div id='all-convos-top'>
                <img id='all-convos-user-icon' />
                <div id='all-convos-top-title'>
                    Messages
                </div>
                <img id='all-convos-message-icon' />
            </div>
            <div id='all-convos-bottom'>
                {convos.map((convo) => {
                    return (
                        <SingleConvoBlock
                            user={user}
                            otherUserId={convo.id}
                            lastMessage={convo.lastMessage}
                        />
                    )
                })}
            </div>
        </div>
    )

    const SingleConvo = (
        <div id="single-convo" class={singleConvoClass}>
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
                <button type="submit" class="single-convo-message-button"></button>
            </form>
        </div>
    )

    return (
        <div id='messages' class='page'>
            <Navbar user={user} />
            <div id='messages-page-parent'>
                {AllConvos}
                {SingleConvo}
            </div>
        </div>
    )
}