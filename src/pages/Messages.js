import '../styles/pages/Messages.css'
import { retrieveAllConvos, retrieveSingleConvo } from '../firebase/directmessages.js'
import { useState } from 'react'
import { Navbar } from '../components/Navbar.js'
import { ConvosList } from '../components/Messages/ConvosList.js'
import { CurrentConvo } from '../components/Messages/CurrentConvo.js'
import { useLocation, Navigate } from 'react-router-dom'


const Messages = async (props) => {
    // Redirect to signup page if not signed in
    const { user } = props
    if (user.loggedIn == false) {
        const path = useLocation().pathname
        return <Navigate to='/signup' state={{path: path}} />
    }

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
                    viewSingleConvo={viewSingleConvo}
                />
                <CurrentConvo
                    user={user}
                    componentClass={currConvoClass}
                    currConvo={currConvo}
                    viewAllConvos={viewAllConvos}
                />
            </div>
        </div>
    )
}

export { Messages }