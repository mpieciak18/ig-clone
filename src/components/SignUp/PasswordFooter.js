import { useState, useEffect } from 'react'
import { usernameExists } from '../firebase/users.js'

const PasswordFooter = async (props) => {
    const { eventHandler } = props
    const [password, setPassword] = useState('')
    const [footerText, setFooterText] = useState(
        'Must contain >8 characters, 1+ uppercase letter, 1+ lowercase letter, and 1+ number.'
    )
    const [footerClass, setFooterClass] = useState('grey')

    // Update passwordPasses state from SignUp page
    const setPasswordPasses = (bool) => {
        eventHandler(bool)
    }

    // Update username on input change
    const updatePassword = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)
    }

    // Update password footer text, class, and passwordPasses state upon password change
    useEffect(async () => {
        // Checks for minimum length of 8
        if (password.match(/^.{0,7}$/) != null) {
            setPasswordPasses(false)
            setFooterText('Password is too short!')
            setFooterClass('red')
        // Checks for at least one uppercase letter
        } else if (password.match(/^[^A-Z]*$/) != null) {
            setPasswordPasses(false)
            setFooterText('Password needs an uppercase letter!')
            setFooterClass('red')
        // Checks for at least one lowercase letter
        } else if (password.match(/^[^a-z]*$/) != null) {
            setPasswordPasses(false)
            setFooterText('Password needs an uppercase letter!')
            setFooterClass('green')
        // Checks for at least one number
        } else if (password.match(/^[^0-9]*$/) != null) {
            setPasswordPasses(false)
            setFooterText('Password needs an uppercase letter!')
            setFooterClass('green')
        } else {
            setUsernamePasses(true)
            setFooterText('Password is good.')
            setFooterClass('grey')
        }
    }, username) 

    return (
        <div id='sign-up-password-footer' className={footerClass} onChange={updatePassword}>
            {footerText}
        </div>
    )
}

export { PasswordFooter }