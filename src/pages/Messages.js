import '../styles/pages/Messages.css'
import {
    retrieveAllConvos,
    retrieveSingleConvo
} from '../firebase/directmessages'
import { useState } from 'react'
import { Navbar } from '../components/Navbar.js'
import { ConvosList } from '../components/Messages/ConvosList.js'
import { CurrentConvo } from '../components/Messages/CurrentConvo.js'

const Messages = async (props) => {
    const { user } = props

    // State consisting of all available convos in user's collection
    const [convos, setConvos] = useState(await retrieveAllConvos())

    // State determing which convo is selected, to be rendered on page
    const [currConvo, setCurrConvo] = useState(null)

    // States & methods determining mobile vs. desktop visibility
    const [convosListClass, setConvosListClass] = useState('visible')
    const [currConvoClass, setCurrConvoClass] = useState('hidden')
    const viewAllConvos = () => {
        setConvosListClass('visible')
        setCurrConvoClass('hidden')
    }
    const viewSingleConvo = async (convoId) => {
        const otherUserId = convoId
        setConvosListClass('hidden')
        setCurrConvoClass('visible')
        const messages = await retrieveSingleConvo(otherUserId)
        setCurrConvo({otherUserId: otherUserId, messages: messages})
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
                    eventHandler={() => viewAllConvos}
                />
            </div>
        </div>
    )
}

export { Messages }