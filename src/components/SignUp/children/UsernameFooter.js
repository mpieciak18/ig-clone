import { useState, useEffect } from 'react'
import { usernameExists } from '../../../firebase/users.js'

const UsernameFooter = async (props) => {
    const { setUsernamePasses, username } = props
    const [footerText, setFooterText] = useState('Username must be 3-15 characters.')
    const [footerClass, setFooterClass] = useState('grey')

    // Update username footer text, className, and usernamePasses state upon username change
    useEffect(async () => {
        // First, query db for username if > 2 and < 16
        let result = false
        if (username.length > 2 && username.length < 16) {
            result = await usernameExists(username)
        }
        // Second, check if username passes criteria
        // Check if no username entered
        if (username.match(/^.{0,0}$/) != null) {
            setUsernamePasses(false)
            setFooterText('Username must be 3-15 characters.')
            setFooterClass('grey')
        }
        // Check if username is 1 or 2 characters
        else if (username.match(/^.{1,2}$/) != null) {
            setUsernamePasses(false)
            setFooterText('Username is too short!')
            setFooterClass('red')
        }
        // Check if username is more than 15 characters
        else if (username.match(/^.{16,}$/) != null) {
            setUsernamePasses(false)
            setFooterText('Username is too long!')
            setFooterClass('red')
        }
        // Check if username is taken already
        else if (result == true) {
            setUsernamePasses(false)
            setFooterText('Username is already taken!')
            setFooterClass('red')
        }
        // Check if username contains spaces or symbols other than "-" or "_"
        else if (username.match(/^[a-zA-Z0-9_.-]*$/) == null) {
            setUsernamePasses(false)
            setFooterText('No spaces or symbols, other than "-" or "_"!')
            setFooterClass('red')
        }
        // Username passes
        else {
            setUsernamePasses(true)
            setFooterText('Username can be used!')
            setFooterClass('green')
        }
    }, [username]) 

    return (
        <div id='sign-up-username-footer' className={footerClass}>
            {footerText}
        </div>
    )
}

export { UsernameFooter }