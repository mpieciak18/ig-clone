import { Navigate, useLocation } from 'react-router-dom'

const PostButtons = (props) => {
    const { user, postId, postOwnerId } = props

    const clickLike = () => {
        //
    }
    
    const clickComment = () => {
        //
    }
    
    const clickShare = () => {
        //
    }
    
    const clickSave = () => {
        //
    }
    const redirect = () => {
        const path = useLocation().pathname
        return <Navigate to='/signup' state={{path: path}} />
    }
    if (user.loggedIn == true) {
        return (
            <div class="post-buttons">
                <div class="post-buttons-left">
                    <img class="post-like-button" onClick={clickLike} />
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
                    <img class="post-like-button" onClick={redirect} />
                    <img class="post-comment-button" onClick={redirect}/>
                    <img class="post-share-button" onClick={clickShare}/>
                </div>
                <img class="post-save-button" onClick={redirect}/>
            </div> 
        )
    }
}

export { PostButtons }