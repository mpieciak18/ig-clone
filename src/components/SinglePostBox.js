import '../styles/components/SinglePostBox.css'
import { Link } from 'react-router-dom'

const SinglePostBox = async (props) => {
    const { id, text, image, date, postOwnerId, likes, comments, user } = props

    const likesNum = likes.length
    const commentsNum = comments.length

    return (
        <Link 
            class="single-post-box" 
            to={`/${postOwnerId}/${id}`}
            state={id, text, image, date, postOwnerId, likes, comments, user}
        >
            <img class="single-post-box-image" src={image}/>
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

export { SinglePostBox }