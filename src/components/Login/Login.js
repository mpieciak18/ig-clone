import './Login.css'
import { Navbar } from '../other/Navbar.js'
import { signInUser } from '../../firebase/users.js'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Login = (props) => {
    // Redirect to home if already logged in
    const { user, popUpState, updatePopUp } = props

    const navigate = useNavigate()

    if (user == null) {
        navigate('/')
    }

    const newLogin = async (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        // Add new user to firebase/auth & return any errors
        const possibleError = await signInUser(email, password)
        if (possibleError == null) {
            navigate('/')
        } else {
            setErrorClass('visible')
            setTimeout(() => {setErrorClass('hidden')}, 2000)
        }
    }

    const [errorClass, setErrorClass] = useState('hidden')

    const errorMessage = (
        <div id='login-error' className={errorClass}>
            There was an error! Please try again.
        </div>
    )

    return (
        <div id="login" className="page">
            <Navbar user={user} popUpState={popUpState} updatePopUp={updatePopUp} />
            <div id='login-parent'>
                <form id='login-form' onSubmit={newLogin}>
                    {errorMessage}
                    <div id='login-header'>
                        <img id='login-logo' />
                        <div id='login-title'>Login</div>
                    </div>
                    <div id='login-email-parent'>
                        <input id='login-email-input' name='email' placeholder='email' />
                    </div>
                    <div id='login-password-parent'>
                        <input id='login-password-input' type='password' name='password' placeholder='password' />
                    </div>
                    <button type='submit' id='login-form-button' className='active'>
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export { Login }