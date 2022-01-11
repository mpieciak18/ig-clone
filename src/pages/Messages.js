import '../styles/Messages.css'
import {
    sendMessage,
    retrieveAllConvos,
    retrieveSingleConvo,
} from '../firebase/directmessages'
import { useState } from 'react'
import { Navbar } from '../components/Navbar.js'
import { ConvosList } from '../components/ConvosList.js'

const Messages = async (props) => {
    const [user] = props

    const [convos, setConvos] = useState(await retrieveAllConvos())

    const [currConvo, setCurrConvo] = useState(null)

    // The following React states determine mobile vs. desktop visibility
    const [convosListClass, setConvosListClass] = useState('visible')
    const [currConvoClass, setCurrConvoClass] = useState('hidden')

    const viewAllConvos = () => {
        setConvosListClass('visible')
        setCurrConvoClass('hidden')
    }
    const viewSingleConvo = async (event) => {
        const otherUserId = event.target.id
        setConvosListClass('hidden')
        setCurrConvoClass('visible')
        const messages = await retrieveSingleConvo(otherUserId)
        setCurrConvo({otherUserId: otherUserId, messages: messages})
    }

    const sendNewMessage = async (event) => {
        event.preventDefault()
        const message = document.getElementById('single-convo-message-bar-input').value
        let date
        const otherUserId = currConvo.otherUserId
        await sendMessage(message, date, otherUserId)
    }

    return (
        <div id='messages' class='page'>
            <Navbar user={user} />
            <div id='messages-page-parent'>
                <ConvosList
                    user={user}
                    componentClass={convosListClass}
                    convos={convos}
                    currConvo={currConvo}
                    eventHandler={() => viewSingleConvo}
                />
                <CurrentConvo
                    user={user}
                    componentClass={currConvoClass}
                    currConvo={currConvo}
                    eventHandler={() => sendNewMessage}
                />
            </div>
        </div>
    )
}

export { Messages }