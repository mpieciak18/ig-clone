import './Messages.css'
import { retrieveConvos } from '../../firebase/messages.js'
import { useState, useEffect } from 'react'
import { Navbar } from '../other/Navbar.js'
import { Link } from 'react-router-dom'
import { findUser } from '../../firebase/users'
import { getUrl } from '../../firebase/storage'
import { timeSinceTrunc } from '../../other/timeSinceTrunc.js'
import MessageSolid from '../../assets/images/dm.png'

const Messages = (props) => {
    // Redirect to signup page if not signed in
    const { user, setUser, popUpState, updatePopUp } = props

    // Init user image state
    const [userImage, setUserImage] = useState(null)

    // Init convos count state
    const [convosCount, setConvosCount] = useState(20)

    // Init convos arr state
    const [convosArr, setConvosArr] = useState(null)

    // Init all convos loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Init convos list component state
    const [convosList, setConvosList] = useState(null)

    // Init convos component state
    const [convos, setConvos] = useState(null)

    // Update userImage state when user changes
    useEffect(async () => {
        if (user != null) {
            const img = await getUrl(user.data.image)
            setUserImage(img)
        } else {
            setUserImage(null)
        }
    }, [user])

    // Update convosArr state when convosCount or user changes
    useEffect(async () => {
        if (user != null) {
            const newConvosArr = await retrieveConvos(convosCount)
            console.log(newConvosArr)
            if (newConvosArr != null) {
                setConvosArr(newConvosArr)
                if (newConvosArr.length < convosCount) {
                    setAllLoaded('true')
                } 
            } else {
                setConvosArr(null)
            }
        } else {
            setConvosArr(null)
        }
    }, [convosCount, user])

    // Update convos list state when convosArr state changes
    useEffect(async () => {
        if (convosArr != null) {
            const convosObjs = convosArr.map(async (convo) => {
                // Other user variables
                const otherUserId = convo.id
                const otherUser = await findUser(otherUserId)
                const name = otherUser.data.name
                const username = otherUser.data.username
                const image = await getUrl(otherUser.data.image)
                // Last message variables
                const message = convo.lastMessage.data.message
                const time = timeSinceTrunc(convo.lastMessage.data.date)
                let sender
                if (convo.lastMessage.data.sender == user.id) {
                    sender = "You"
                } else {
                    sender = "Them"
                }
                return (
                    <Link className='convo-row' key={otherUserId} to={`/messages/${otherUserId}`}>
                        <div className='convo-row-left'>
                            <img className='convo-image' src={image} />
                            <div className='convo-text'>
                                <div className='convo-name'>{name}</div>
                                <div className='convo-username'>@{username}</div>
                            </div>
                        </div>
                        <div className='convo-row-right'>
                            <div className='convo-row-message'>{sender}: "{message}"</div>
                            <div className='convo-row-time'>{time}</div>
                        </div>
                    </Link>
                )
            })
            const returnVal = await Promise.all(convosObjs)
            setConvosList(returnVal)
        } else {
            setConvosList(null)
        }
    }, [convosArr])

    // Update convos state when convos list and user image states change
    useEffect(() => {
        if (user != null) {
            setConvos(
                <div id="convos">
                    <div id='convos-top'>
                        <img id='convos-user-icon' src={userImage} />
                        <div id='convos-title'>
                            Messages
                        </div>
                        <div id='convos-message-icon-container'>
                            <img id='convos-message-icon' src={MessageSolid} />
                        </div>
                    </div>
                    <div id='convos-divider'></div>
                    <div id='convos-bottom'>
                        {convosList}
                    </div>
                </div>
            )
        } else {
            setConvos(null)
        }
    }, [convosList, userImage, user])

    // Load-more function that updates the convos component
    const loadMore = () => {
        if (allLoaded == false) {
            const newConvosCount = convosCount + 10
            setConvosCount(newConvosCount)
        }
    }

    // Trigger loadMore when user scrolls to bottom of page
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 2) {
            loadMore()
      }
    })

    return (
        <div id='messages' className='page'>
            <Navbar user={user} setUser={setUser} popUpState={popUpState} updatePopUp={updatePopUp} />
            {convos}
        </div>
    )
}

export { Messages }