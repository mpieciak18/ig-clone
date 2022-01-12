import '../styles/components/SinglePostBox.css'

const SinglePostBox = async (props) => {
    const { id, text, date, postOwnerId, likes, user } = props

    return (
        <div class="single-post-box">
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
        </div>
    )
}

export { SinglePostBox }