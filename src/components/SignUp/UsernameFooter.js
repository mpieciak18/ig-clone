import { useState, useEffect } from 'react'
import { usernameExists } from '../firebase/users.js'

const UsernameFooter = async (props) => {
    const { eventHandler } = props
    const [username, setUsername] = useState('')
    const [unameFooterText, setUnameFooterText] = useState('Username must be 3-15 characters.')
    const [unameFooterClass, setUnameFooterClass] = useState('grey')

    // Update usernamePasses state from SignUp page
    const setUsernamePasses = (bool) => {
        eventHandler(bool)
    }

    // Update username on input change
    const updateUsername = (e) => {
        const newUsername = e.target.value
        setUsername(newUsername)
    }

    // Update username footer text, class, and unameExists state upon username change
    useEffect(async () => {
        // First, query db for username if > 0
        let result = false
        if (username.length > 3) {
            result = await usernameExists(username)
        }
        // Second, update username footer text, class, & unameExists
        if (username.length < 4) {
            setUsernamePasses(false)
            setUnameFooterText('Username is too short!')
            setUnameFooterClass('grey')
        }
        else if (result == true) {
            setUsernamePasses(false)
            setUnameFooterText('Username is already taken!')
            setUnameFooterClass('red')
        } else if (username.length > 0 && result == false) {
            setUsernamePasses(true)
            setUnameFooterText('Username can be used!')
            setUnameFooterClass('green')
        } else {
            setUsernamePasses(false)
            setUnameFooterText('Username must be 3-15 characters.')
            setUnameFooterClass('grey')
        }
    }, username) 

    return (
        <div id='sign-up-username-footer' className={unameFooterClass} onChange={updateUsername}>
            {unameFooterText}
        </div>
    )
}

export { UsernameFooter }