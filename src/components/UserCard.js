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
            <Link id="user-card" to={`/${user.id}`}>
                <div id="user-card-top">
                    <img id='user-card-icon' src={async () => await getUrl(user.image)} />
                    <div id="user-card-names">
                        <div id='user-card-name'>{user.name}</div>
                        <div id='user-card-username'>{user.username}</div>
                    </div>
                </div>
                <div id='user-card-stats'>
                    <div id='user-card-posts'>{user.posts}</div>
                    <div id='user-card-following'>{user.following}</div>
                    <div id='user-card-followers'>{user.followers}</div>
                </div>
            </Link>
        )
    }
}

export { UserCard }