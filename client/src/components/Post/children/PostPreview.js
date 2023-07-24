import '../styles/PostPreview.css'
import { Link } from 'react-router-dom'
import { getUrl } from '../../../firebase/storage.js'
import { useEffect, useState } from 'react'
import LikeIcon from '../../../assets/images/like.png'
import CommentsIcon from '../../../assets/images/messages.png'

const PostPreview = (props) => {
    const { postId, postText, postImage, postDate, postOwnerId, postLikes, postComments } = props

    const [img, setImg] = useState(null)

    const [overlay, setOverlay] = useState('inactive')

    useEffect(async () => {
        const imgSrc = await getUrl(postImage)
        setImg(imgSrc)
    }, [])

    return (
        <Link 
            className="single-post-box"
            to={`/${postOwnerId}/${postId}`}
            onPointerDown={() => setOverlay('active')}
            onPointerUp={() => setOverlay('inactive')}
            onMouseOver={() => setOverlay('active')}
            onMouseOut={() => setOverlay('inactive')}
        >
            <img className="single-post-box-image" src={img} />
            <div className={`single-post-box-overlay ${overlay}`}>
                <div className="single-post-box-likes">
                    <img className="single-post-box-likes-icon" src={LikeIcon} />
                    <div className="single-post-box-likes-number">{postLikes}</div>
                </div>
                <div className="single-post-box-comments">
                    <img className="single-post-box-comments-icon" src={CommentsIcon} />
                    <div className="single-post-box-comments-number">{postComments}</div>
                </div>
            </div>
        </Link>
    )
}

export { PostPreview }