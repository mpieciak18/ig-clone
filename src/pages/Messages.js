import '../styles/Messages.css'
import {
    sendMessage,
    retrieveAllConvos,
    retrieveSingleConvo,
    retrieveLatestMessage 
} from '../firebase/directmessages'
import { useState } from 'react'
import { Navbar } from '../components/Navbar.js'

const Messages = async (props) => {
    const [user] = props
    const [convos, setConvos] = useState(await retrieveAllConvos(user.id))
    // This state determines conversation to render
    const [currentConvoMessages, setCurrentConvoMessages] = useState(null)
    // These states determine what's visible when on mobile
    const [allConvosClass, setAllConvosCall] = useState('visible')
    const [singleConvoClass, setSingleConvoClass] = useState('hidden')

    const viewAllConvos = () => {
        setAllConvosCall('visible')
        setSingleConvoClass('hidden')
    }
    const viewSingleConvo = async (event) => {
        const convoId = event.target.id
        setAllConvosCall('hidden')
        setSingleConvoClass('visible')
        setCurrentConvo(await retrieveSingleConvo(convoId))
    }

    const AllConvos = (
        <div id="all-convos">
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
                            convoId={convo.id}
                            lastMessage={convo.lastMessage}
                        />
                    )
                })}
            </div>
        </div>
    )

    const SingleConvo = (
        <div id="single-convo">
            <div id="single-convo-messages">
                {currentConvoMessages.map((message) => {
                    return (
                        <SingleMessageBlock
                            user={user}
                            messageId={message.id}
                            message={message.data}
                        />
                    )
                })}
            </div>
            <div class="single-convo-message-bar">
                <div class="single-convo-message-bar-input"></div>
                <div class="single-convo-message-button"></div>
            </div>
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