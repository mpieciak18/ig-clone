import './Messages.css'
import { retrieveAllConvos } from '../../firebase/messages.js'
import { useState } from 'react'
import { Navbar } from '../other/Navbar.js'
import { ConvosList } from './children/ConvosList.js'
import { useLocation, Navigate } from 'react-router-dom'


const Messages = (props) => {
    // Redirect to signup page if not signed in
    const { user, setUser, popUpState, updatePopUp } = props
    const path = useLocation().pathname

    const redirect = () => <Navigate to='/signup' state={{path: path}} />
    if (user.loggedIn == false) {
        redirect() 
    }

    // State consisting of all available convos in user's collection
    const [convosArr, setConvosArr] = useState(
        (async () => await retrieveAllConvos())()
    )

    return (
        <div id='messages' className='page'>
            <Navbar user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
            <ConvosList
                user={user}
                convosArr={convosArr}
                setConvosArr={setConvosArr}
            />
        </div>
    )
}

export { Messages }