const CommentButton = async (props) => {
    const { user, redirect, inputRef } = props

    // Runs when comment button is clicked and sets focus on ref (which is the comment input bar on the post)
    const commentButtonFunction = () => {
        inputRef.current.focus()
    }

    if (user.loggedIn == true) {
        return <img className="post-comment-button" onClick={commentButtonFunction}/> 
    } else {
        return <img className="post-comment-button" onClick={redirect} />
    }
}

export { CommentButton }