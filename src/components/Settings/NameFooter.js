import { useState, useEffect } from 'react'

const NameFooter = async (props) => {
    const { setNamePasses } = props
    const [name, setName] = useState('')
    const [footerText, setFooterText] = useState('Name must contain letters & spaces only.')
    const [footerClass, setFooterClass] = useState('grey')

    // Update username on input change
    const updateName = (e) => {
        const newName = e.target.value
        setName(newName)
    }

    // Update name footer text, class, and namePasses state upon username change
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
        // Name passes
        else {
            setNamePasses(true)
            setFooterText(' ')
            setFooterClass('grey')
        }
    }, name) 

    return (
        <div id='settings-name-footer' className={footerClass} onChange={updateName}>
            {footerText}
        </div>
    )
}

export { NameFooter }