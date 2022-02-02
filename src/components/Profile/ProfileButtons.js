import '.../styles/components/Profile/ProfileButtons.css'
import { FollowButton } from '../FollowButton.js'
import { Navigate } from 'react-router-dom'
import { signOutUser } from '../../firebase/users.js'

const ProfileButtons = async (props) => {
    const { self, userId } = props

    // Logs user out
    const clickLogout = async () => {
        await signOutUser()
        return <Navigate to='/' />
    }

    // Sends user to settings
    const clickSettings = () => {
        return <Navigate to='/settings' />
    }

    // Sends user to messages
    const clickMessages = () => {
        return <Navigate to='/messages' recipient={userId} />
    }

    if (self.id == userId) {
        return (
            <div id='profile-buttons-section'>
                <div id='profile-settings-button' onClick={clickSettings}>Settings</div>
                <div id='profile-logout-button' onClick={clickLogout}>Logout</div>
            </div>
        )
    } else {
        return (
            <div id='profile-buttons-section'>
                <FollowButton userId={userId} />
                <div id='profile-direct-message-button-container' onClick={clickMessages}>
                    <img id='profile-direct-message-button' />
                </div>
            </div>
        )
    }
}

export { ProfileButtons }