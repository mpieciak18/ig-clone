import { getComments } from "../../../../firebase/comments.js"
import { findUser } from "../../../../firebase/users.js"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { timeSinceTrunc } from "../../../../other/timeSinceTrunc.js"
import { getUrl } from "../../../../firebase/storage.js"

const CommentsFull = (props) => {
    const { postId, postOwnerId, postOwnerImage, postText, postOwnerName, commentsNum } = props

    // Init comment quantity (ie, how many comments are rendered) state
    const [commentQuantity, setCommentQuantity] = useState(10)

    // Init all loaded state
    const [allLoaded, setAllLoaded] = useState(false)

    // Init comments array state
    const [commentsArr, setCommentsArr] = useState(null) 
    
    // Init comment component state
    const [comments, setComments] = useState(null) 

    // Update commentsArr when commentsNum (total comments on a post) or commentQuantity (how many are rendered) changes
    // E.g., user submits new comment on a post OR scrolls to load more
    useEffect(async () => {
        const array = await getComments(postOwnerId, postId, commentQuantity)
        if (array != undefined) {
            setCommentsArr(array)
            // Declare all comments loaded if new array length < commentQuantity
            if (array.length < commentQuantity) {
                setAllLoaded(true)
            }
        } else {
            setCommentsArr(null)
        }
    }, [commentsNum, commentQuantity])

    // Update comments component when commentsArr changes in response to the useEffect statement above
    useEffect(async () => {
        if (commentsArr != null) {
            const commentsObjs = commentsArr.map(async (comment) => {
                const commenterId = comment.data.user
                const commenter = await findUser(commenterId)
                const commenterName = commenter.data.name
                const commenterImage = await getUrl(commenter.data.image)
                const commentDate = timeSinceTrunc(comment.data.date)
                return (
                    <div className='post-comment' key={comment.id}>
                        <div className='post-comment-left'>
                            <Link to={`/${commenterId}`} className='post-comment-icon'>
                                <img src={commenterImage} />
                            </Link>
                            <div className='post-comment-text'>
                                <Link to={`/${commenterId}`} className='post-comment-name'>{commenterName}</Link>
                                <div className='post-comment-text'>{comment.data.text}</div>
                            </div>
                        </div>
                        <div className='post-comment-right'>
                            {commentDate}
                        </div>
                    </div>
                )
            })
            const returnVal = await Promise.all(commentsObjs)
            setComments(returnVal)
        } else {
            setComments(null)
        }
    }, [commentsArr])

    // Load more comments on scroll
    const loadMore = (e) => {
        const elem = e.target
        if ((Math.ceil(elem.scrollHeight - elem.scrollTop) == elem.clientHeight) &&
        (allLoaded == false)) {
            const newCommentQuantity = commentQuantity + 10
            setCommentQuantity(newCommentQuantity)
        }
    }

    // Update comments arr state on init render 
    useEffect(async () => {
        const array = await getComments(postOwnerId, postId, 10)
        if (array != undefined) {
            setCommentsArr(array)
        }
        else {
            setCommentsArr(null)
        }
      }, [])

    // Return component
    return (
        <div id="comments-grid" onScroll={loadMore}>
            <div className='post-comment'>
                <div className='post-comment-left' key={'first-comment'}>
                    <Link to={`/${postOwnerId}`} className='post-comment-icon'>
                        <img src={postOwnerImage} />
                    </Link>
                    <div className='post-comment-text'>
                        <Link to={`/${postOwnerId}`} className='post-comment-name'>{postOwnerName}</Link>
                        <div className='post-comment-text'>{postText}</div>
                    </div>
                </div>
                <div className='post-comment-right'>
                    ...
                </div>
            </div>
            {comments}
        </div>
    )
}

export { CommentsFull }