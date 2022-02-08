import './Settings.css'
import { Link } from 'react-router-dom'
import { updateUser } from '../../firebase/users.js'
import { useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { NameFooter } from './children/NameFooter.js'
import { ImageInput } from './children/ImageInput.js'
import { uploadFile } from '../../firebase/storage'

const Settings = (props) => {
    // Redirect to signup page if not signed in
    const { user } = props
    const path = useLocation().pathname
    const redirect = () => <Navigate to='/signup' state={{path: path}} />
    if (user.loggedIn == false) {
        redirect()
    }

    const [file, setFile] = useState(null)
    const inputRef = useRef()

    // Updates user's settings with form values
    const updateSettings = async (e) => {
        e.preventDefault()
        // Check validation first
        if (namePasses == true) {
            let image
            if (file == null) {
                image = user.image
            } else {
                image = file.name
                await uploadFile('images', file)
            }
            const possibleError = await updateUser(
                image,
                name,
                bio
            )
            if (possibleError == null) {
                // Redirect to own profile upon successful settings update
                return <Navigate to={`/${user.id}`} />
            } else {
                setErrorClass('visible')
                setTimeout(() => {setErrorClass('hidden')}, 2000)
            }
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

    const state = useLocation().state
    let newSignUp
    if (state == null) {
        newSignUp = false
    } else {
        newSignUp = state.newSignUp
    }

    if (newSignUp == true) {
        setWelcomeOn(true)
        setTimeout(() => {setWelcomeOn(false)}, 2000)
    }

    // Allow form to submit if name input is valid
    const [namePasses, setNamePasses] = useState(true)
    const [name, setName] = useState(user.name)
    const updateName = (e) => setName(e.target.value)

    const [formButton, setFormButton] = useState("submit")

    useEffect(() => {
        if (namePasses == true) {
            setFormButton('submit')
        } else {
            setFormButton('button')
        }
    }, [namePasses])

    const [bio, setBio] = useState(user.bio)
    const updateBio = (e) => setBio(e.target.value)

    return (
        <div id='settings' className='page'>
            {welcomeMessage()}
            <div id='settings-parent'>
                <form id='settings-form' onSubmit={updateSettings}>
                    {errorMessage}
                    <div id='settings-header'>
                        <div id='settings-title'>Settings</div>
                        <img id='settings-image'/>
                    </div>
                    <ImageInput user={user} setFile={setFile} inputRef={inputRef} />
                    <div id='settings-image-footer'>File size limit: 5 mb</div>
                    <label id='settings-name-label' htmlFor='name'>Your Name:</label>
                    <input id='settings-name-input' name='name' type='text' value={name} onChange={updateName}></input>
                    <NameFooter setNamePasses={setNamePasses} name={name} />
                    <label id='settings-bio-label' htmlFor='bio'>Your Bio:</label>
                    <textarea id='settings-bio-input' name='bio' type='text' value={bio} maxLength='150' onChange={updateBio} />
                    <div id='settings-buttons'>
                        <Link to={`/profile/${user.id}`}>
                            <button id='settings-form-back' type='button'>Back to Profile</button>
                        </Link>
                        <button id='settings-form-submit' type={formButton} className={formButton}>Update Settings</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export { Settings }