import { FollowButton } from '../../other/FollowButton.js'
import { useNavigate, useLocation } from 'react-router-dom'
import { signOutUser } from '../../../firebase/users.js'
import { useState, useEffect } from 'react'
import MessageHollow from '../../../assets/images/dm.png'
import MessageSolid from '../../../assets/images/dm-solid.png'

const ProfileButtons = (props) => {
    const { user, otherUserId } = props

    const navigate = useNavigate()

    const path = useLocation()

    // Init img state
    const [img, setImg] = useState(MessageHollow)

    // Logs user out
    const clickLogout = async () => {
        await signOutUser()
        navigate('/') 
    }

    // Sends user to settings
    const clickSettings = () => {
        navigate('/settings')
    }

    // Sends user to messages
    const clickMessages = () => {
        if (user != null) {
            navigate('/messages', {state: {recipient: otherUserId}})
        } else {
            navigate('/signup', {state: {path: path}})
        }
    }

    // Init buttons component state
    const [buttons, setButtons] = useState(null)

    // Update buttons component state when user prop changes and on render
    useEffect(() => {
        if (user == null) {
            setButtons(
                <div id='profile-buttons-section'>
                    <FollowButton otherUserId={otherUserId} />
                    <div id='profile-direct-message-button-container'>
                        <img id='profile-direct-message-button' onClick={clickMessages} />
                    </div>
                </div>
            )
        } else if (user.id != otherUserId) {
            setButtons(
                <div id='profile-buttons-section'>
                    <FollowButton
                        user={user}
                        otherUserId={otherUserId}
                    />
                    <div id='profile-direct-message-button-container'>
                        <img 
                            id='profile-direct-message-button' 
                            src={img}
                            onClick={clickMessages}
                            onMouseDown={() => setImg(MessageSolid)}
                            onMouseUp={() => setImg(MessageHollow)}
                            onMouseOver={() => setImg(MessageSolid)}
                            onMouseOut={() => setImg(MessageHollow)}
                        />
                    </div>
                </div>
            )
        } else {
            setButtons(
                <div id='profile-buttons-section'>
                    <div id='profile-settings-button' onClick={clickSettings}>Settings</div>
                    <div id='profile-logout-button' onClick={clickLogout}>Logout</div>
                </div>
            )
        }
    }, [user])

    return buttons
}

export { ProfileButtons }