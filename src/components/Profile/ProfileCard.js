import '../../styles/components/Profile/ProfileCard.css'
import { getUrl } from '../../firebase/storage'

const ProfileCard = async (props) => {
    const { user } = props

    return (
        <div id='profile-card'>
            <img id='profile-card-icon' src={async () => await getUrl(user.image)} />
            <div id='profile-card-name'>{user.name}</div>
            <div id='profile-card-username'>{user.username}</div>
            <div id='profile-card-stats'>
                <div id='profile-card-posts'>
                    <p className='profile-stats-child'>{user.posts}</p>
                    <p className='profile-stats-child'>Posts</p>
                </div>
                <div id='profile-card-following'>
                    <p className='profile-stats-child'>{user.following}</p>
                    <p className='profile-stats-child'>Following</p>
                </div>
                <div id='profile-card-followers'>
                    <p className='profile-stats-child'>{user.followers}</p>
                    <p className='profile-stats-child'>Followers</p>
                </div>
            </div>
            <div id='profile-card-bio'>{user.bio}</div>
        </div>
    )
}

export { ProfileCard }