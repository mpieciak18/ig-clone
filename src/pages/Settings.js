import '../styles/pages/Settings.css'

const Settings = (props) => {
    const { user } = props

    return (
        <div id='settings' className='page'>
            <div id='settings-title'>Settings</div>
            <img id='settings-image'/>
            <form id='settings-form'>
                <label id='settings-name-label' for='name'>Your Name:</label>
                <input id='settings-name-input' name='name' type='text'>{user.name}</input>
                <label id='settings-username-label' for='username'>Your Display Name:</label>
                <input id='settings-username-input' name='username' type='text'>{user.username}</input>
                <label id='settings-bio-label' for='bio'>Your Bio:</label>
                <textarea id='settings-bio-input' name='bio' type=''>{user.bio}</textarea>
                <div id='settings-buttons'>
                    <button type='button'>Back to Profile</button>
                    <button type='submit'>Update Settings</button>
                </div>
            </form>
        </div>
    )
}

export { Settings }