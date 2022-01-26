import '.../styles/components/PostPreview.css'
import { Link } from 'react-router-dom'

const PostPreview = async (props) => {
    const { postId, postText, postImage, postDate, postOwnerId, postLikes, postComments } = props
    const likesNum = postLikes.length
    const commentsNum = postComments.length
    const post = {
        id: id,
        text: text, 
        image: image, 
        date: date, 
        postOwnerId: postOwnerId, 
        likes: likes,
        comments: comments
    }

    return (
        <Link class="single-post-box" to={`/${postOwnerId}/${postId}`} state={{post: post}}>
            <img class="single-post-box-image" src={async () => await getUrl(postImage)}/>
            <div class="single-post-box-overlay">
                <div class="single-post-box-likes">
                    <img class="single-post-box-likes-icon" />
                    <div class="single-post-box-likes-number">{likesNum}</div>
                </div>
                <div class="single-post-box-comments">
                    <img class="single-post-box-comments-icon" />
                    <div class="single-post-box-comments-number">{commentsNum}</div>
                </div>
            </div>
        </Link>
    )
}

export { PostPreview }