import '../styles/Post.css'
import { useParams, useLocation } from 'react-router-dom'
import { SinglePost } from '../components/SinglePost.js'
import { findSinglePost } from '../firebase/posts.js'
import { Navbar } from '../components/Navbar.js'

const { postOwnerId, postId } = useParams()

const Post = (props) => {
    const { user } = props

    // Get post data from state passed via Link using useLocation
    // If nothing is passed, then query post data from database
    const location = useLocation()
    let post = location.state
    if (post == undefined) {
        post = findSinglePost(postId, postOwnerId)
    } 

    const BackButton = (
        <div id='post-back-button'>
            <div id='back-arrow'>⇽</div>
            <div id='back-text'>Back to Profile</div>
        </div>
    )

    return (
        <div id="post" class="page">
            <Navbar user={user} />
            {BackButton}
            <SinglePost 
                page="true" 
                id={postId}
                text={post.data.text}
                image={post.data.image}
                date={post.data.date}
                postOwnerId={postOwnerId}
                likes={post.data.likes}
                comments={post.data.comments}
                user={user}
            />
        </div>
    )
}

export { Post }