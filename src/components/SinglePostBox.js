import '../styles/components/SinglePostBox.css'
import { useParams, Link } from 'react-router-dom'

const SinglePostBox = async (props) => {
    const { id, postOwnerId, likes, user } = props

    return (
        <Link class="single-post-box" to={`/${postOwnerId}/${id}`} state={user}>
            <img class="single-post-box-image" />
            <div class="single-post-box-overlay">
                <div class="single-post-box-likes">
                    <img class="single-post-box-likes-icon" />
                    <div class="single-post-box-likes-number"></div>
                </div>
                <div class="single-post-box-comments">
                    <img class="single-post-box-comments-icon" />
                    <div class="single-post-box-comments-number"></div>
                </div>
            </div>
        </Link>
    )
}

export { SinglePostBox }