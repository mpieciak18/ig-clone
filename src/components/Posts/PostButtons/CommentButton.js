const CommentButton = async (props) => {
    const { user, redirect, inputRef } = props

    // Runs when comment button is clicked and sets focus on ref (which is the comment input bar on the post)
    const commentButtonFunction = () => {
        inputRef.current.focus()
    }
    
    // Redirect user to sign-up page if not signed in / signed up
    const redirectToSignUp = () => {
        redirect()
    }

    if (user.loggedIn == true) {
        return <img class="post-comment-button" onClick={commentButtonFunction}/> 
    } else {
        return <img class="post-comment-button" onClick={redirectToSignUp} />
    }
}

export { CommentButton }