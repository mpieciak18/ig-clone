import '../styles/components/ConvosList.css'

const ConvosList = (props) => {
    const { user, componentClass, convos, currentConvo, eventHandler } = props

    const viewConvo = () => {return eventHandler()}

    const AllConvosList = (
        <div id='convos-list-bottom'>
            {convos.map((convo) => {
                    if (currentConvo.otherUserId == convo.id) {
                        return (
                            <SingleConvoBlock
                                onClick={() => viewConvo}
                                user={user}
                                otherUserId={convo.id}
                                lastMessage={convo.lastMessage}
                                currentConvo={true}
                            />
                        )
                    } else {
                        return (
                            <SingleConvoBlock
                                onClick={() => viewConvo}
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