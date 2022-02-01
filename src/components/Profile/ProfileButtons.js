import '.../styles/components/Profile/ProfileButtons.css'
import { FollowButton } from '../FollowButton.js'
import { Navigate } from 'react-router-dom'
import { signOutUser } from '../../firebase/users.js'

const ProfileButtons = async (props) => {
    const { self, userId } = props

    // Logs user out
    const logout = async () => {
        await signOutUser()
        return <Navigate to='/' />
    }

    // Sends user to settings
    const settings = () => {
        return <Navigate to='/settings' />
    }

    if (self.id == userId) {
        return (
            <div id='profile-buttons-section'>
                <div id='profile-settings-button' onClick={settings}>Settings</div>
                <div id='profile-logout-button' onClick={logout}>Logout</div>
            </div>
        )
    } else {
        return (
            <div id='profile-buttons-section'>
                <FollowButton userId={userId} />
                <div id='profile-direct-message-button-container'>
                    <img id='profile-direct-message-button' />
                </div>
            </div>
        )
    }
}

export { ProfileButtons }