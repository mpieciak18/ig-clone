import { isEditable } from "@testing-library/user-event/dist/utils"
import { useState, useEffect } from "react"

const ConvoForm = (props) => {
    const { messageValue, updateMessage, sendNewMessage } = props
    
    const [buttonClass, setButtonClass] = useState('inactive')

    const [buttonType, setButtonType] = useState('button')

    const [form, setForm] = useState(null)

    // Update buttonClass & buttonType when messageValue changes
    useEffect(() => {
        if (messageValue.length > 0) {
            setButtonClass('active')
            setButtonType('submit')
        } else {
            setButtonClass('inactive')
            setButtonType('button')
        }
    }, [messageValue]) 

    // Update form when buttonClass, buttonType, & messageValue change
    useEffect(() => {
        setForm(
            <form id="convo-message-bar" onSubmit={sendNewMessage}>
                <input type="text" id="convo-message-bar-input" placeholder="Send a message..." value={messageValue} onChange={updateMessage} />
                <button type={buttonType} id='convo-message-button' className={buttonClass}>Send</button>
            </form>
        )
    }, [buttonClass, buttonType, messageValue])

    return form
}

export { ConvoForm }