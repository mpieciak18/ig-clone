import { useState, useEffect } from 'react'
import { emailExists } from '../firebase/users.js'

const EmailFooter = async (props) => {
    const { setEmailPasses } = props
    const [email, setEmail] = useState('')
    const [footerText, setFooterText] = useState(
        'Email address must be valid.'
    )
    const [footerClass, setFooterClass] = useState('grey')

    // Update email on input change
    const updateEmail = (e) => {
        const newEmail = e.target.value
        setEmail(newEmail)
    }

    // Regex variable for RFC 5322 standard for valid email addresses
    const reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    // Update email footer text, class, and emailPasses state upon email change
    useEffect(async () => {
        // Checks if no email is entered
        if (email.length == 0) {
            setEmailPasses(false)
            setFooterText('Must contain >8 characters, 1+ uppercase letter, 1+ lowercase letter, and 1+ number.')
            setFooterClass('grey')
        // Checks for invalid email
        } else if (email.match(reg) == null) {
            setEmailPasses(false)
            setFooterText('Email is too short!')
            setFooterClass('red')
        // Checks if email already exists
        } else if (emailExists(email)) {
            setEmailPasses(false)
            setFooterText('Email is already taken!')
            setFooterClass('red')
        // Valid email
        } else {
            setEmailPasses(true)
            setFooterText('Email is good.')
            setFooterClass('grey')
        }
    }, email) 

    return (
        <div id='sign-up-email-footer' className={footerClass} onChange={updateEmail}>
            {footerText}
        </div>
    )
}

export { EmailFooter }