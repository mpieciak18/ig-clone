import '../styles/Messages.css'
import {
    retrieveAllConvos,
    retrieveSingleConvo
} from '../firebase/directmessages'
import { useState } from 'react'
import { Navbar } from '../components/Navbar.js'
import { ConvosList } from '../components/ConvosList.js'

const Messages = async (props) => {
    const { user } = props

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
                />
            </div>
        </div>
    )
}

export { Messages }