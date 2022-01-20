import { Navigate, useLocation } from 'react-router-dom'
import { LikeButton } from './PostButtons/LikeButton.js'

const PostButtons = async (props) => {
    const { user, postId, postOwnerId } = props
    
    const clickComment = () => {
        //
    }
    
    const clickShare = () => {
        //
    }
    
    const clickSave = () => {
        //
    }
    
    const redirectToSignUp = () => {
        const path = useLocation().pathname
        return <Navigate to='/signup' state={{path: path}} />
    }

    if (user.loggedIn == true) {
        return (
            <div class="post-buttons">
                <div class="post-buttons-left">
                    <LikeButton user={user} postId={postId} postOwnerId={postOwnerId} redirect={redirectToSignUp} />
                    <img class="post-comment-button" onClick={clickComment}/>
                    <img class="post-share-button" onClick={clickShare}/>
                </div>
                <img class="post-save-button" onClick={clickSave}/>
            </div>
        ) 
    } else {
        return (
            <div class="post-buttons">
                <div class="post-buttons-left">
                    <LikeButton user={user} postId={postId} postOwnerId={postOwnerId} redirect={redirectToSignUp} />
                    <img class="post-comment-button" onClick={redirect}/>
                    <img class="post-share-button" onClick={clickShare}/>
                </div>
                <img class="post-save-button" onClick={redirect}/>
            </div> 
        )
    }
}

export { PostButtons }