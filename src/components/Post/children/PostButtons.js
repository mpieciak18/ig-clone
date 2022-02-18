import { useNavigate, useLocation } from 'react-router-dom'
import { LikeButton } from './PostButtons/LikeButton.js'
import { SaveButton } from './PostButtons/SaveButton.js'
import { CommentButton } from './PostButtons/CommentButton.js'
import { ShareButton } from './PostButtons/ShareButton.js'

const PostButtons = (props) => {
    const { user, postId, postOwnerId, inputRef, likesNum, setLikesNum, setLinkCopied } = props
    
    const path = useLocation().pathname

    const navigate = useNavigate()

    const redirectToSignUp = () => {
        navigate('/signup', {state: {path: path}})
    }

    return (
        <div className="post-buttons">
            <div className="post-buttons-left">
                <LikeButton 
                    user={user}
                    postId={postId}
                    postOwnerId={postOwnerId}
                    redirect={redirectToSignUp}
                    likesNum={likesNum}
                    setLikesNum={setLikesNum}
                />
                <CommentButton
                    user={user}
                    redirect={redirectToSignUp}
                    inputRef={inputRef}
                />
                <ShareButton
                    postId={postId}
                    postOwnerId={postOwnerId}
                    setLinkCopied={setLinkCopied}
                />
            </div>
            <SaveButton
                user={user}
                postId={postId}
                postOwnerId={postOwnerId}
                redirect={redirectToSignUp}
            />
        </div>
    ) 
}

export { PostButtons }