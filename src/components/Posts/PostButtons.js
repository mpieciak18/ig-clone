import { Navigate, useLocation } from 'react-router-dom'
import { LikeButton } from './PostButtons/LikeButton.js'
import { SaveButton } from './PostButtons/SaveButton.js'
import { CommentButton } from './PostButtons/CommentButton.js'
import { ShareButton } from './PostButtons/ShareButton.js'

const PostButtons = async (props) => {
    const { user, postId, postOwnerId, inputRef } = props
    
    const clickShare = () => {
        //
    }
    
    const redirectToSignUp = () => {
        const path = useLocation().pathname
        return <Navigate to='/signup' state={{path: path}} />
    }

    return (
        <div class="post-buttons">
            <div class="post-buttons-left">
                <LikeButton user={user} postId={postId} postOwnerId={postOwnerId} redirect={redirectToSignUp} />
                <CommentButton user={user} redirect={redirectToSignUp} inputRef={inputRef} />
                <ShareButton />
            </div>
            <SaveButton user={user} postId={postId} postOwnerId={postOwnerId} redirect={redirectToSignUp} />
        </div>
    ) 
}

export { PostButtons }