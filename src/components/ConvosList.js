import '../styles/components/ConvosList.css'
import ConvoPreview from '../components/ConvoPreview.js'

// Component for the list of all available convos in a user's messages page.
// Clicking on a ConvoPreview subcomponent will then render it on the CurrentConvo
// sibling component, found on the Messages page.
const ConvosList = (props) => {
    const { user, componentClass, convos, currentConvo, eventHandler } = props

    // Method passed from Messages to ConvosList to ConvoPreview
    const viewSingleConvo = (convoId) => {
        eventHandler(convoId)
    }

    // JSX element containing child elements that display each
    // available convo in the users messages.
    const AllConvosList = (
        <div id='convos-list-bottom'>
            {convos.map((convo) => {
                    if (currentConvo.otherUserId == convo.id) {
                        return (
                            <ConvoPreview
                                eventHandler={() => viewSingleConvo}
                                user={user}
                                otherUserId={convo.id}
                                lastMessage={convo.lastMessage}
                                currentConvo={true}
                            />
                        )
                    } else {
                        return (
                            <ConvoPreview
                                eventHandler={() => viewSingleConvo}
                                user={user}
                                otherUserId={convo.id}
                                lastMessage={convo.lastMessage}
                                currentConvo={false}
                            />
                        )
                    }
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
            {AllConvosList}
        </div>
    )
}

export { ConvosList }