import CommentHollow from '../../../../assets/images/messages.png'
import CommentSolid from '../../../../assets/images/messages-solid.png'
import {useState} from 'react'

const CommentButton = (props) => {
    const { user, redirect, inputRef } = props

    const [img, setImg] = useState(CommentHollow)

    // Runs when comment button is clicked and sets focus on ref (which is the comment input bar on the post)
    const commentButtonFunction = () => {
        if (user != null) {
            inputRef.current.focus()
        } else {
            redirect()
        }
    }

    return (
        <img
            className="post-comment-button"
            onClick={commentButtonFunction}
            onMouseDown={() => setImg(CommentSolid)}
            onMouseUp={() => setImg(CommentHollow)}
            onMouseOver={() => setImg(CommentSolid)}
            onMouseOut={() => setImg(CommentHollow)}
            src={img}
        />
    )
}

export { CommentButton }