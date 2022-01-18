import '../styles/pages/SignUp.css'
import { Navbar } from '../components/Navbar'
import { UsernameFooter } from '../components/SignUp/UsernameFooter.js'
import { PasswordFooter } from '../components/SignUp/PasswordFooter.js'
import { NameFooter } from '../components/SignUp/NameFooter'
import { newUser } from '../firebase/users.js'
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const SignUp = (props) => {
    // Redirect to settings if already signed in
    const { user } = props
    if (user.loggedIn == true) {
        return <Navigate to='/settings' />
    }

    // Init criteria for allowing form to be submitted
    const [usernamePasses, setUsernamePasses] = useState(false)
    const [namePasses, setNamePasses] = useState(false)
    const [passwordPasses, setPasswordPasses] = useState(false)
    const [emailPasses, setEmailPasses] = useState(false)

    const allPass = () => {
        return (
            usernamePasses == true && 
            namePasses == true &&
            passwordPasses == true && 
            emailPasses == true
        )
    }

    const newSignUp = async (e) => {
        const username = e.target.username.value
        const name = e.target.name.value
        const email = e.target.email.value
        const password = e.target.password.value
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
                        <input id='sign-up-username-input' name='username' placeholder='username' onChange={updateUsername} />
                    </div>
                    <UsernameFooter eventHandler={() => setUsernamePasses} />
                    <div id='sign-up-name-parent'>
                        <input id='sign-up-name-input' name='name' placeholder='your real name' />
                    </div>
                    <NameFooter eventHandler={() => setNamePasses} />
                    <div id='sign-up-email-parent'>
                        <input id='sign-up-email-input' name='email' placeholder='email' />
                    </div>
                    <EmailFooter eventHandler={() => setEmailPasses} />
                    <div id='sign-up-password-parent'>
                        <input id='sign-up-password-input' name='password' placeholder='password' />
                    </div>
                    <PasswordFooter eventHandler={() => setPasswordPasses} />
                    {signUpButton}
                </form>
            </div>
        </div>
    )
}

export { SignUp }