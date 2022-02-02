import '../styles/components/Messages/ConvosList.css'
import ConvoPreview from '../components/ConvoPreview.js'

// Component for the list of all available convos in a user's messages page.
// Clicking on a ConvoPreview subcomponent will then render it on the CurrentConvo
// sibling component, found on the Messages page.
const ConvosList = (props) => {
    const { user, componentClass, convos, currConvo, viewSingleConvo, recipient, setConvos } = props

    // Update convos list if a recipient is designated
    if (recipient != undefined) {
        // Check if recipient is in pre-existing convo
        const convosItem = convos.find((user) => {
            return user.id == recipient
        })
        // Move recipient's convo to the front of the list if pre-existing
        if (convosItem != undefined) {
            const index = convos.indexOf(convosItem)
            const newConvos = [convosItem, ...convos.slice(0, index), ...convos.slice(index + 1)]
            setConvos(newConvos)
        } else {
            const newConvo = {
                id: recipient,
                lastMessage: {
                    id: 'test',
                    data: {
                        sender: '',
                        recipient: '',
                        date: '',
                        message: '',
                        senderChange: ''
                    }
                }
            }
            const newConvos = [newConvo, ...convos]
            setConvos(newConvos)
        }
    }

    // JSX element containing child elements that display each
    // available convo in the users messages.
    const allConvosList = (
        <div id='convos-list-bottom'>
            {convos.map((convo) => {
                return (
                    <ConvoPreview
                        eventHandler={viewSingleConvo}
                        user={user}
                        otherUserId={convo.id}
                        lastMessage={convo.lastMessage}
                        currConvo={currConvo}
                    />
                )
            })}
        </div>
    )

    return (
        <div id="convos-list" class={componentClass}>
            <div id='convos-list-top'>
                <img id='convos-list-user-icon' />
                <div id='convos-list-top-title'>
                    Messages
                </div>
                <img id='convos-list-message-icon' />
            </div>
            {allConvosList}
        </div>
    )
}

export { ConvosList }