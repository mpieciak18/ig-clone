import './styles/PostPreview.css'
import { Link } from 'react-router-dom'
import { getUrl } from '../../../firebase/storage.js'

const PostPreview = async (props) => {
    const { postId, postText, postImage, postDate, postOwnerId, postLikes, postComments } = props
    const likesNum = postLikes.length
    const commentsNum = postComments.length

    return (
        <Link className="single-post-box" to={`/${postOwnerId}/${postId}`}>
            <img className="single-post-box-image" src={async () => await getUrl(postImage)}/>
            <div className="single-post-box-overlay">
                <div className="single-post-box-likes">
                    <img className="single-post-box-likes-icon" />
                    <div className="single-post-box-likes-number">{likesNum}</div>
                </div>
                <div className="single-post-box-comments">
                    <img className="single-post-box-comments-icon" />
                    <div className="single-post-box-comments-number">{commentsNum}</div>
                </div>
            </div>
        </Link>
    )
}

export { PostPreview }