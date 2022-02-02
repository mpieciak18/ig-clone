import '../styles/pages/Messages.css'
import { retrieveAllConvos } from '../firebase/messages.js'
import { useState } from 'react'
import { Navbar } from '../components/Navbar.js'
import { ConvosList } from '../components/Messages/ConvosList.js'
import { useLocation, Navigate } from 'react-router-dom'


const Messages = async (props) => {
    // Redirect to signup page if not signed in
    const { user } = props
    if (user.loggedIn == false) {
        const path = useLocation().pathname
        return <Navigate to='/signup' state={{path: path}} />
    }

    // State consisting of all available convos in user's collection
    const [convosArr, setConvosArr] = useState(await retrieveAllConvos())

    return (
        <div id='messages' class='page'>
            <Navbar user={user} />
            <ConvosList
                user={user}
                convosArr={convosArr}
                setConvosArr={setConvosArr}
            />
        </div>
    )
}

export { Messages }