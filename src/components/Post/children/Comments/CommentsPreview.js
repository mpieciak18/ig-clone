import { getComments } from "../../../../firebase/comments.js"
import { findUser } from "../../../../firebase/users.js"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const CommentsPreview = (props) => {
    const {postId, postOwnerId, commentsNum } = props

    // Init comments array state
    const [commentsArr, setCommentsArr] = useState(null) 
    
    // Init comment component state
    const [comments, setComments] = useState(null) 

    // Update commentsArr when comments count changes
    useEffect(async () => {
        const array = await getComments(postOwnerId, postId, 2)
        if (array != undefined) {
            array.reverse()
            setCommentsArr(array)
        } else {
            setCommentsArr(null)
        }
    }, [commentsNum])

    // Update comments component when commentsArr changes
    useEffect(async () => {
        if (commentsArr != null) {
            const commentsObjs = commentsArr.map(async (comment) => {
                const commenterId = comment.data.user
                const commenter = await findUser(commenterId)
                const commenterName = commenter.data.name
                return (
                    <div className='post-comment' key={comment.id}>
                        <Link to={`/profile/${commenterId}`} className='post-comment-name'>{commenterName}</Link>
                        <div className='post=comment-text'>{comment.data.text}</div>
                    </div>
                )
            })
            const returnVal = await Promise.all(commentsObjs)
            setComments(returnVal)
        } else {
            setComments(null)
        }
    }, [commentsArr])

    // Update comments arr state on render
    useEffect(async () => {
        const array = await getComments(postOwnerId, postId, 2)
        if (array != undefined) {
            array.reverse()
            setCommentsArr(array)
        }
        else {
            setCommentsArr(null)
        }
      }, [])

    // Return component
    return (
        <div className="post-comments">
            {comments}
        </div>
    )
}

export { CommentsPreview }