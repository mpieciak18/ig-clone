import { useParams, useNavigate } from 'react-router-dom'
import './Conversation.css'
import { sendMessage, retrieveSingleConvo } from '../../firebase/messages.js'
import { useEffect, useState } from 'react'
import { ConvoMessages } from './children/ConvoMessages'
import { ConvoForm } from './children/ConvoForm'
import { Navbar } from '../other/Navbar'
import { findUser } from '../../firebase/users'
import { convoSnapshot } from '../../firebase/messages.js'

const Conversation = (props) => {
    const { user, setUser, popUpState, updatePopUp } = props

    const navigate = useNavigate()

    // Grab other user's id from url parameters
    const { otherUserId } = useParams()

    // Init other user state
    const [otherUser, setOtherUser] = useState(null)

    // Init convo title component state
    const [convoTitle, setConvoTitle] = useState(null)

    // Init messages array state
    const [messagesArr, setMessagesArr] = useState(null)

    // Set initial message input value & reset it on submission
    const [messageValue, setMessageValue] = useState('')

    // Use onSnapshot to update messages array real-time
    useEffect(() => {
        convoSnapshot(otherUserId, setMessagesArr)
    }, [])

    // Update other user & messages array states when user changes
    useEffect(async () => {
        if (user != null) {
            const otherUser = await findUser(otherUserId)
            setOtherUser(otherUser)
            const newMessagesArr = await retrieveSingleConvo(otherUserId)
            setMessagesArr(newMessagesArr)
        }
    }, [user])

    // Update convo title component when other user state changes
    useEffect(() => {
        if (otherUser != null) {
            setConvoTitle(
                <div id='convo-title-container'>
                    <div id='title'>{otherUser.data.name}</div>
                    <div id='subtitle' onClick={redirect}>@{otherUser.data.username}</div>
                </div>
            )
        }
    }, [otherUser])

    // Updates message state / field
    const updateMessage = (e) => {
        const val = e.target.value
        setMessageValue(val)
    }

    // Add new message to specific convo in db
    const sendNewMessage = async (e) => {
        e.preventDefault()
        if (messageValue.length > 0) {
            await sendMessage(messageValue, otherUserId)
            setMessageValue('')
            // const newMessagesArr = await retrieveSingleConvo(otherUserId)
            // setMessagesArr(newMessagesArr)
        }
    }

    // Redirect back to messages page
    const goBack = () => navigate('/messages')

    // Redirect to other user's page
    const redirect = () => navigate(`/${otherUserId}`)

    return (
        <div id="conversation" className='page'>
            <Navbar user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
            <div id='conversation-container'>
                <div id="convo-header">
                    <div id='convo-back-arrow' onClick={goBack}>« Go Back</div>
                    {convoTitle}
                    <div id='convo-back-arrow-hidden'>« Go Back</div>
                </div>
                <ConvoMessages user={user} otherUserId={otherUserId} messagesArr={messagesArr} />
                <ConvoForm messageValue={messageValue} updateMessage={updateMessage} sendNewMessage={sendNewMessage} />
            </div>
        </div>
    )
}

export { Conversation }