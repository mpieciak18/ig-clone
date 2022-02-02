import '../styles/components/Messages/ConvoPreview.css'
import {useState, useEffect} from 'react'
import {timeSinceTrunc} from '../../other/timeSinceTrunc.js'

// Component for each available convo in the convo list
const ConvoPreview = async (props) => {
    const { user, otherUserId, lastMessage, currentConvo, viewSingleConvo } = props
    
    // Determine init value for convoPreviewClass state
    let initClass
    if (currentConvo == true) {
        initClass = 'convo-prevew current'
    } else {
        initClass = 'convo-preview' 
    }

    // Declare state for ConvoPreview class name
    const [convoPreviewClass, setConvoPreviewClass] = useState(initClass)

    // Update convoPreviewClass based on currentConvo
    const updateClass = () => {
        if (currentConvo == true) {
            setConvoPreviewClass('convo-preview current')
        } else {
            setConvoPreviewClass('convo-preview')
        }
    }

    // Trigger updateclass() whenever currentConvo changes
    useEffect(() => {
        updateClass()
    }, [currentConvo])

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