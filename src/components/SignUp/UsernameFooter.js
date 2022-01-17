import { useState, useEffect } from 'react'
import { usernameExists } from '../firebase/users.js'

const UsernameFooter = async (props) => {
    const { eventHandler } = props
    const [username, setUsername] = useState('')
    const [footerText, setFooterText] = useState('Username must be 3-15 characters.')
    const [footerClass, setFooterClass] = useState('grey')

    // Update usernamePasses state from SignUp page
    const setUsernamePasses = (bool) => {
        eventHandler(bool)
    }

    // Update username on input change
    const updateUsername = (e) => {
        const newUsername = e.target.value
        setUsername(newUsername)
    }

    // Update username footer text, class, and usernamePasses state upon username change
    useEffect(async () => {
        // First, query db for username if > 3 and < 16
        let result = false
        if (username.length > 3 && username.length < 16) {
            result = await usernameExists(username)
        }
        // Second, update username footer text, class, & usernamePasses
        if (username.length < 4) {
            setUsernamePasses(false)
            setFooterText('Username is too short!')
            setFooterClass('red')
        }
        else if (username.length > 15) {
            setUsernamePasses(false)
            setFooterText('Username is too long!')
            setFooterClass('red')
        }
        else if (result == true) {
            setUsernamePasses(false)
            setFooterText('Username is already taken!')
            setFooterClass('red')
        } else if (username.length > 0 && result == false) {
            setUsernamePasses(true)
            setFooterText('Username can be used!')
            setFooterClass('green')
        } else {
            setUsernamePasses(false)
            setFooterText('Username must be 3-15 characters.')
            setFooterClass('grey')
        }
    }, username) 

    return (
        <div id='sign-up-username-footer' className={footerClass} onChange={updateUsername}>
            {footerText}
        </div>
    )
}

export { UsernameFooter }