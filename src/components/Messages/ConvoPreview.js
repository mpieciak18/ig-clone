import '../styles/components/Messages/ConvoPreview.css'
import {useState, useEffect} from 'react'
import {timeSinceTrunc} from '../../other/timeSinceTrunc.js'

// Component for each available convo in the convo list
const ConvoPreview = async (props) => {
    const { user, otherUserId, lastMessage, currConvo, viewSingleConvo } = props
    
    // Determine init value for convoPreviewClass state
    let initClass
    if (currConvo.id == otherUserId) {
        initClass = 'convo-prevew current'
    } else {
        initClass = 'convo-preview' 
    }

    // Declare state for ConvoPreview class name
    const [convoPreviewClass, setConvoPreviewClass] = useState(initClass)

    // Update convoPreviewClass based on currentConvo
    const updateClass = () => {
        if (currConvo.id == otherUserId) {
            setConvoPreviewClass('convo-preview current')
        } else {
            setConvoPreviewClass('convo-preview')
        }
    }

    // Trigger updateclass() whenever currentConvo changes
    useEffect(() => {
        updateClass()
    }, [currConvo])

    // Time since last message
    const time = timeSinceTrunc(lastMessage.data.date)

    return (
        <div className={convoPreviewClass} onClick={() => viewSingleConvo(otherUserId)}>
            <img className='convo-preview-left' />
            <div className='convo-preview-right'>
                <div className='convo-preview-name'></div>
                <div className='convo-preview-right-bottom'>
                    <div className='convo-preview-text'></div>
                    <div className='convo-preview-date'>{time}</div>
                </div>
            </div>
        </div>
    )
}

export { ConvoPreview }