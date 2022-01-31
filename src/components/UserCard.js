import { Link } from "react-router-dom"
import { getUrl } from "../firebase/storage"

const UserCard = (props) => {
    const { user } = props

    if (user.loggedIn == false) {
        return (
            <div id="user-card">
                <Link id="user-card-sign-up">Sign Up</Link>
                <Link id="user-card-login">Login</Link>
            </div>
        )
    } else {
        return (
            <div id="user-card">
                <Link id="user-card-top" to={`/${user.id}`}>
                    <img id='user-card-icon' src={async () => await getUrl(user.image)} />
                    <div id="user-card-names">
                        <div id='user-card-name'>{user.name}</div>
                        <div id='user-card-username'>{user.username}</div>
                    </div>
                </Link>
                <div id='user-card-stats'>
                    <div id='user-card-posts'>
                        <p className='user-stats-child'>{user.posts}</p>
                        <p className='user-stats-child'>Posts</p>
                    </div>
                    <div id='user-card-following'>
                        <p className='user-stats-child'>{user.following}</p>
                        <p className='user-stats-child'>Following</p>
                    </div>
                    <div id='user-card-followers'>
                        <p className='user-stats-child'>{user.followers}</p>
                        <p className='user-stats-child'>Followers</p>
                    </div>
                </div>
            </div>
        )
    }
}

export { UserCard }