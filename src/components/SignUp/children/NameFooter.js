import { useState, useEffect } from 'react'

const NameFooter = (props) => {
    const { setNamePasses, name } = props
    const [footerText, setFooterText] = useState('Name must contain letters & spaces only.')
    const [footerClass, setFooterClass] = useState('grey')

    // Update name footer text, className, and namePasses state upon username change
    useEffect(async () => {
        // Check if no name is entered
        if (name.match(/^.{0,0}$/) != null) {
            setNamePasses(false)
            setFooterText('Name must contain letters & spaces only.')
            setFooterClass('grey')
        }
        // Check if name only contains letters or spaces
        else if (name.match(/^[a-zA-Z\s]*$/) == null) {
            setNamePasses(false)
            setFooterText('No spaces or symbols, other than "-" or "_"!')
            setFooterClass('red')
        }
        // Check if name is greater than 30 characters
        else if (name.match(/^.{31,}$/) != null) {
            setNamePasses(false)
            setFooterText('Name is too long!')
            setFooterClass('red')
        }
        // Check if name is greater than 3 characters
        else if (name.match(/^.{0,2}$/) != null) {
            setNamePasses(false)
            setFooterText('Name is too short!')
            setFooterClass('red')
        }
        // Username passes
        else {
            setNamePasses(true)
            setFooterText('Name is good.')
            setFooterClass('')
        }
    }, [name]) 

    return (
        <div id='sign-up-name-footer' className={`${footerClass} sign-up-input-footer`}>
            {footerText}
        </div>
    )
}

export { NameFooter }