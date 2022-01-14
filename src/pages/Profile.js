import '../styles/pages/Profile.js'
import Navbar from '../components/Navbar.js'
import PostPreview from '../components/PostPreview.js'
import { findPostsFromUser } from '../firebase/posts.js'
import { findUser } from '../firebase/users.js'
import { checkForFollow, addFollow, removeFollow } from '../firebase/followers.js'
import { useParams, useHistory } from 'react-router-dom'
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

    // Profile card section
    const ProfileCard = (
        <div id='profile-card'>
            <img id='profile-card-icon' src={otherUser.data.image} />
            <div id='profile-card-name'>{otherUser.data.name}</div>
            <div id='profile-card-username'>{otherUser.username}</div>
            <div id='profile-card-stats'>
                <div id='profile-card-posts'>{otherUser.data.posts}</div>
                <div id='profile-card-following'>{otherUser.data.following}</div>
                <div id='profile-card-followers'>{otherUser.data.followers}</div>
            </div>
            <div id='profile-card-bio'>{otherUser.data.bio}</div>
        </div>
    )

    // Set up history & back function
    const history = useHistory()
    const goBack = () => {history.goBack()}

    // Init followText & followButtonClass states
    const isFollowing = await checkForFollow(otherUserId)
    const [followText, setFollowText] = useState(() => {
        if (isFollowing == true) {
            return 'Follow'
        } else {
            return 'Unfollow'
        }
    })
    const [followButtonClass, setFollowButtonClass] = useState('loaded')

    // Update follow status & associated states
    const clickFollow = async () => {
        setFollowButtonClass('not-loaded')
        if (followText == 'Follow') {
            await addFollow(otherUserId)
            setFollowText('Unfollow')
            setFollowButtonClass('loaded')
        } else {
            await removeFollow(otherUserId)
            setFollowText('Follow')
            setFollowButtonClass('loaded')
        }
    }

    // Back, follow, & message button sections
    const ButtonsSection = (
        <div id='buttons-section'>
            <div id='post-back-button' onClick={goBack}>
                <div id='back-arrow'>⇽</div>
                <div id='back-text'>Go Back</div>
            </div>
            <div id='buttons-section-right'>
                <div id='follow-button' class={followButtonClass} onClick={clickFollow}>
                    {followText}
                </div>
                <div id='direct-message-button-container'>
                    <img id='direct-message-button' />
                </div>
            </div>
        </div>
    )

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
                {ProfileCard}
                {Posts}
                {LoadButton}
            </div>
        </div>
    )
}

export { Profile }