import '../styles/Navbar.css'

const Navbar = (props) => {
    const [user] = props

    return (
        <div id="navbar">
            {/* Visible only on mobile screen dimensions*/}
            <div id="header-mobile">
                <img class="logo" />
            </div>
            <div id="footer-mobile">
                <img class="home-button" />
                <img class="search-button" />
                <img class="add-post-button" />
                <img class="notifications-button" />
                <img class="messages-button" />
            </div>
            {/* Visible only on desktop screen dimensions*/}
            <div id="header-desktop">
                <div id="header-desktop-left">
                    <img class="logo"></img>
                </div>
                <div id="header-desktop-right">
                    <img class="home-button" />
                    <img class="search-button" />
                    <img class="add-post-button" />
                    <img class="notifications-button" />
                    <img class="messages-button" />
                </div>
            </div>
        </div>
    )
}