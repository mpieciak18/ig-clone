import '../styles/pages/Profile.js'
import Navbar from '../components/Navbar.js'
import PostPreview from '../components/PostPreview.js'
import ProfileCard from '../components/Profile/ProfileCard.js'
import ProfileButtons from '../components/Profile/ProfileButtons.js'
import { findPostsFromUser } from '../firebase/posts.js'
import { findUser } from '../firebase/users.js'
import { useParams } from 'react-router-dom'
import { useState } from 'react'

const Profile = async (props) => {
    const { user } = props

    // Get other user id from url parameters
    const { otherUserId } = useParams()

    // Get profile user data from database
    const otherUser = await findUser(otherUserId)

    // Init postsNumber state
    const [postsNumber, setPostsNumber] = await useState(10)

    // Init posts state
    const postsArr = await findPostsFromUser(postsNumber)
    const [posts, setPosts] = useState(postsArr)

    // Load-more function that updates the posts reel
    const loadMore = () => {
        const newPostsNumber = postsNumber + 10
        setPostsNumber(newPostsNumber)
    }

    // Load More button
    const LoadButton = (
        <div id='load-more-button' onClick={loadMore}>Load More</div>
    )

    // Update posts state when postsNumber state changes
    useEffect(async () => {
        const newPostsArr = await findPosts(postsNumber)
        setPosts(newPostsArr)
    }, postsNumber)

    // Posts section
    const Posts = (
        <div id='user-posts'>
            {posts.map((post) => {
                return (
                    <PostPreview
                        id={post.id}
                        text={post.data.text}
                        image={post.data.image}
                        date={post.data.date}
                        postOwnerId={post.data.user}
                        likes={post.data.likes}
                        comments={post.data.image}
                        user={user}
                    />
                )
            })}
        </div>
    )

    return (
        <div id='profile'>
            <Navbar user={user} />
            <div id='profile-contents'>
                <div id='profile-contents-left'>
                    <ProfileCard user={otherUser.data}/>
                </div>
                <div id='profile-contents-right'>
                    <ProfileButtons userId={otherUserId} />
                    {Posts}
                    {LoadButton}
                </div>
            </div>
        </div>
    )
}

export { Profile }