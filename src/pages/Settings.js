import '../styles/pages/Settings.css'
import { Link } from 'react-router-dom'
import { updateUser } from '../firebase/users.js'

const Settings = (props) => {
    const { user } = props

    // Updates user's settings with form values
    const updateSettings = async (e) => {
        e.preventDefault()
        await updateUser(
            e.target.name.value,
            e.target.username.value,
            e.target.bio.value
        )
    }

    return (
        <div id='settings' className='page'>
            <div id='settings-title'>Settings</div>
            <img id='settings-image'/>
            <form id='settings-form' onSubmit={updateSettings}>
                <label id='settings-name-label' for='name'>Your Name:</label>
                <input id='settings-name-input' name='name' type='text'>{user.name}</input>
                <label id='settings-username-label' for='username'>Your Display Name:</label>
                <input id='settings-username-input' name='username' type='text'>{user.username}</input>
                <label id='settings-bio-label' for='bio'>Your Bio:</label>
                <textarea id='settings-bio-input' name='bio' type=''>{user.bio}</textarea>
                <div id='settings-buttons'>
                    <Link to={`/profile/${user.id}`}>
                        <button type='button'>Back to Profile</button>
                    </Link>
                    <button type='submit'>Update Settings</button>
                </div>
            </form>
        </div>
    )
}

export { Settings }