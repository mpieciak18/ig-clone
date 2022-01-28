import '../styles/pages/Settings.css'
import { Link } from 'react-router-dom'
import { updateUser, useRef } from '../firebase/users.js'
import { useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { getUrl } from '../firebase/storage'

const Settings = (props) => {
    // Redirect to signup page if not signed in
    const { user } = props
    if (user.loggedIn == false) {
        const path = useLocation().pathname
        return <Navigate to='/signup' state={{path: path}} />
    }

    const imageRef = useRef()

    const [file, setFile] = useState(null)

    // const [isValid, setIsValid] = useState(false)

    const [filePreview, setFilePreview] = useState(await getUrl('images', user.image))

    const [formButton, setFormButton] = useState("submit")

    const maxFileSize = 10 * 1024 * 1024 // 5 MB

    // Runs when user selects image to upload
    const validateImage = async (e) => {
        if (e.target.files[0].size > maxFileSize) {
            imageRef.current.value = ''
            setFile(null)
            setFilePreview(getUrl('images', user.image))
            setFormButton("button")
        } else {
            setFile(e.target.files[0])
            setFilePreview(URL.createObjectURL(e.target.files[0]))
            setFormButton("submit")
        }
    }

    // Updates user's settings with form values
    const updateSettings = async (e) => {
        e.preventDefault()
        let image
        if (file == null) {
            image = user.image
        } else {
            image = file.name
            await uploadFile('images', file)
        }
        const possibleError = await updateUser(
            image,
            e.target.name.value,
            e.target.username.value,
            e.target.bio.value
        )
        if (possibleError == null) {
            // Redirect to own profile upon successful settings update
            return <Navigate to={`/${user.id}`} />
        } else {
            setErrorClass('visible')
            setTimeout(() => {setErrorClass('hidden')}, 2000)
        }
    }
    
    // Display error upon unsuccessful settings update
    const [errorClass, setErrorClass] = useState('hidden')

    const errorMessage = (
        <div id='settings-error' className={errorClass}>
            There was an error! Please try again.
        </div>
    )

    // Display pop-up upon new user registration
    const [welcomeOn, setWelcomeOn] = useState(false)

    const welcomeMessage = () => {
        if (welcomeOn == true) {
            return (
                <div id='settings-welcome'>
                    You've successfully registered! Please update your bio and image.
                </div>
            )
        } else {
            return null
        }
    }

    const newSignUp = useLocation().state.newSignUp || false

    if (newSignUp == true) {
        setWelcomeOn(true)
        setTimeout(() => {setWelcomeOn(false)}, 2000)
    }

    return (
        <div id='settings' className='page'>
            {welcomeMessage}
            <div id='settings-parent'>
                <form id='settings-form' onSubmit={updateSettings}>
                    {errorMessage}
                    <div id='settings-header'>
                        <div id='settings-title'>Settings</div>
                        <img id='settings-image'/>
                    </div>
                    <input 
                        ref={imageRef} 
                        type="file" 
                        id="settings-image" 
                        name="image" 
                        accept=".jpg, .jpeg, .png" 
                        onChange={validateImage}
                    >
                        <img src={filePreview} />
                    </input>
                    <div id='settings-image-footer'>File size limit: 5 mb</div>
                    <label id='settings-name-label' for='name'>Your Name:</label>
                    <input id='settings-name-input' name='name' type='text' value={user.name}></input>
                    <label id='settings-bio-label' for='bio'>Your Bio:</label>
                    <input id='settings-bio-input' name='bio' type='text' value={user.bio}></input>
                    <div id='settings-buttons'>
                        <Link to={`/profile/${user.id}`}>
                            <button type='button'>Back to Profile</button>
                        </Link>
                        <button type={formButton}>Update Settings</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export { Settings }