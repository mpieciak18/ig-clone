import { Navigate, useLocation } from 'react-router-dom'
import { LikeButton } from './PostButtons/LikeButton.js'
import { SaveButton } from './PostButtons/SaveButton.js'

const PostButtons = async (props) => {
    const { user, postId, postOwnerId } = props
    
    const clickComment = () => {
        //
    }
    
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
                <img class="post-comment-button" onClick={clickComment}/>
                <img class="post-share-button" onClick={clickShare}/>
            </div>
            <SaveButton user={user} postId={postId} postOwnerId={postOwnerId} redirect={redirectToSignUp} />
        </div>
    ) 
}

export { PostButtons }