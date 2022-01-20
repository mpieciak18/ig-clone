import '../styles/components/Navbar.css'
import { Navigate, useLocation } from 'react-router-dom'

const Navbar = (props) => {
    const { user } = props

    const clickHome = () => {
        return <Navigate to='/' />
    }

    const performSearch = (e) => {
        //
    }

    const clickAddPost = () => {
        if (user.loggedIn == false) {
            const path = useLocation().pathname
            return <Navigate to='/signup' state={{path: path}} />
        } else {
            //
        }
    }

    const clickNotifications = () => {
        if (user.loggedIn == false) {
            const path = useLocation().pathname
            return <Navigate to='/signup' state={{path: path}} />
        } else {
            //
        }
    }
    const clickMessages = () => {
        if (user.loggedIn == false) {
            const path = useLocation().pathname
            return <Navigate to='/signup' state={{path: path}} />
        } else {
            return <Navigate to='/messages' />
        }
    }

    return (
        <div id="navbar">
            <div id="header">
                <img class="logo" />
            </div>
            <div id="footer-or-header">
                <img class="home-button" onClick={clickHome} />
                <img class="search-button" onClick={performSearch} />
                <img class="add-post-button" onClick={clickAddPost} />
                <img class="notifications-button" onClick={clickNotifications} />
                <img class="messages-button" onClick={clickMessages} />
            </div>
        </div>
    )
}

export { Navbar }