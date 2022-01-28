import '../styles/pages/Login.css'
import { Navbar } from '../components/Navbar'
import { signInUser } from '../firebase/users.js'
import { Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Login = (props) => {
    // Redirect to home if already logged in
    const { user } = props
    if (user.loggedIn == true) {
        return <Navigate to='/' />
    }

    const newLogin = async (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        // Add new user to firebase/auth & return any errors
        const possibleError = await signInUser(email, password)
        if (possibleError == null) {
            // Redirect to previous page (if available) OR home
            const prevPath = useLocation().state.path || '/'
            return <Navigate to={prevPath} />
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
            <Navbar user={user} />
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
                        <input id='login-password-input' name='password' placeholder='password' />
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