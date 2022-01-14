import '../styles/components/Messages/ConvoPreview.css'
import {useState, useEffect} from 'react'

// Component for each available convo in the convo list
const ConvoPreview = async (props) => {
    const { user, otherUserId, lastMessage, currentConvo, eventHandler } = props

    // Trigger viewSingleConvo() from Messages.js
    const viewSingleConvo = () => {
        eventHandler(otherUserId)
    }
    
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

    return (
        <div className={convoPreviewClass} onClick={() => viewSingleConvo}>
            <img className='convo-preview-left' />
            <div className='convo-preview-right'>
                <div className='convo-preview-name'></div>
                <div className='convo-preview-text'></div>
            </div>
        </div>
    )
}

export { ConvoPreview }