import '../styles/SinglePost.css'

const SinglePost = async (props) => {
    const [page, id, text, date, postOwnerId, likes, user] = props

    let Post
    // Render post for reel of posts (ie, home page or user page)
    if (page == false) {
        <div id={id} class="single-post-component">
            <div class="post-top"></div>
                <div class="post-top-left">
                    <img class="post-user-avatar" />
                    <div class="post-user-link">
                        <div class='post-user-link-name'></div>
                        <div class='post-user-link-username'></div>
                    </div>
                </div>
                <div class="post-top-right">···</div>
            <div class="post-middle"></div>
            <div class="post-bottom">
                <div class="post-buttons">
                    <img class="like-button"/>
                    <img class="comment-button"/>
                    <img class="share-button"/>
                </div>
                <div class="post-likes"></div>
                <div class="post-view-comments"></div>
                <div class="post-comments"></div>
                <div class="post-comment-bar">
                    <div class="post-comment-bar-input"></div>
                    <div class="post-comment-bar-button"></div>
                </div>
            </div>
        </div>
    // Render post for individual post page
    } else {
        <div id={id} class="single-post-page">
            <div class="post-left"></div>
            <div class="post-right">
                <div class="post-right-top">
                    <div class="post-user">
                        <img class="post-user-avatar" />
                        <div class="post-use-link">
                            <div class='post-user-link-name'></div>
                            <div class='post-user-link-username'></div>
                        </div>
                    </div>
                    <div class="post-text"></div>
                </div>
                <div class="post-right-middle"></div>
                <div class="post-right-bottom">
                    <div class="post-right-bottom-one">
                        <div class="post-buttons">
                            <img class="like-button"/>
                            <img class="comment-button"/>
                            <img class="share-button"/>
                        </div>
                        <div class="post-top-right">···</div>
                    </div>
                    <div class="post-right-bottom-two">
                        <div class="post-likes"></div>
                        <div class="post-date"></div>
                    </div>
                    <div class="post-comment-bar">
                        <div class="post-comment-bar-input"></div>
                        <div class="post-comment-bar-button"></div>
                    </div>
                </div>
            </div>
        </div>
    }

    return {Post}
}

export {SinglePost}