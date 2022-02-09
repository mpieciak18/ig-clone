import './SignUp.css'
import { Navbar } from '../other/Navbar.js'
import { UsernameFooter } from './children/UsernameFooter.js'
import { PasswordFooter } from './children/PasswordFooter.js'
import { NameFooter } from './children/NameFooter.js'
import { EmailFooter } from './children/EmailFooter.js'
import { newUser } from '../../firebase/users.js'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const SignUp = (props) => {
    // Redirect to settings if already signed in
    const { user } = props
    const navigate = useNavigate()
    if (user.loggedIn == true) {
        navigate('/settings')
    }

    // Init criteria for form validation
    const [username, setUsername] = useState('')
    const [usernamePasses, setUsernamePasses] = useState(false)
    const updateUsername = (e) => setUsername(e.target.value)

    const [name, setName] = useState('')
    const [namePasses, setNamePasses] = useState(false)
    const updateName = (e) => setName(e.target.value)

    const [email, setEmail] = useState('')
    const [emailPasses, setEmailPasses] = useState(false)
    const updateEmail = (e) => setEmail(e.target.value)

    const [password, setPassword] = useState('')
    const [passwordPasses, setPasswordPasses] = useState(false)
    const updatePassword = (e) => setPassword(e.target.value)

    const allPass = () => {
        return (
            usernamePasses == true && 
            namePasses == true &&
            passwordPasses == true && 
            emailPasses == true
        )
    }

    const newSignUp = async () => {
        // Add new user to firebase/auth & return any errors
        const possibleError = await newUser(username, name, email, password)
        if (possibleError == null) {
            // Redirect to /settings with state to signify 
            // redirect from successful registration
            return <Navigate to='/settings' state={{newSignUp: true}} />
        } else {
            setErrorClass('visible')
            setTimeout(() => {setErrorClass('hidden')}, 2000)
        }
    }

    const [errorClass, setErrorClass] = useState('hidden')

    const errorMessage = (
        <div id='sign-up-error' className={errorClass}>
            There was an error! Please try again.
        </div>
    )

    const signUpButton = () => {
        if (allPass() == true) {
            return (
                <button type='submit' id='sign-up-form-button' className='active'>
                    Sign Up
                </button>
            )
        } else {
            return (
                <button type='button' id='sign-up-form-button' className='inactive'>
                    Sign Up
                </button>
            )
        }
    }

    const login = (
        <div id='sign-up-login'>
            <div id='sign-up-login-message'>Already Sign Up?</div>
            <button id='sign-up-login-button' onClick={() => navigate('/login')}>Login</button>
        </div>
    )

    return (
        <div id="sign-up" className="page">
            <Navbar user={user} />
            <div id='sign-up-parent'>
                {errorMessage}
                <form id='sign-up-form' onSubmit={newSignUp}>
                    <div id='sign-up-header'>
                        <img id='sign-up-logo' />
                        <div id='sign-up-title'>Sign Up</div>
                    </div>
                    <div id='sign-up-username-parent'>
                        <div id='sign-up-username-symbol'>@</div>
                        <div id='sign-up-username-divider' />
                        <input id='sign-up-username-input' value={username} placeholder='username' onChange={updateUsername} />
                    </div>
                    <UsernameFooter setUsernamePasses={setUsernamePasses} username={username} />
                    <div id='sign-up-name-parent'>
                        <input id='sign-up-name-input' value={name} placeholder='your real name' onChange={updateName} />
                    </div>
                    <NameFooter setNamePasses={setNamePasses} name={name}  />
                    <div id='sign-up-email-parent'>
                        <input id='sign-up-email-input' value={email} placeholder='email' onChange={updateEmail} />
                    </div>
                    <EmailFooter setEmailPasses={setEmailPasses} email={email}  />
                    <div id='sign-up-password-parent'>
                        <input id='sign-up-password-input' value={password} placeholder='password' onChange={updatePassword} />
                    </div>
                    <PasswordFooter setPasswordPasses={setPasswordPasses} password={password}  />
                    {signUpButton()}
                </form>
                {login}
            </div>
        </div>
    )
}

export { SignUp }