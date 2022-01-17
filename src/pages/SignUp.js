import '../styles/pages/SignUp.css'
import { Navbar } from '../components/Navbar'

const SignUp = (props) => {
    const { user } = props

    return (
        <div id="sign-up" className="page">
            <Navbar user={user} />
            <div id='sign-up-parent'>
                <form id='sign-up-form'>
                    <div id='sign-up-header'>
                        <img id='sign-up-logo' />
                        <div id='sign-up-title'>Sign Up</div>
                    </div>
                    <div id='sign-up-username-parent'>
                        <div id='sign-up-username-symbol'>@</div>
                        <div id='sign-up-username-divider' />
                        <input id='sign-up-username-input' name='username' placeholder='username' />
                    </div>
                    {usernameStatus}
                    <div id='sign-up-name-parent'>
                        <input id='sign-up-name-input' name='name' placeholder='your name' />
                    </div>
                    <div id='sign-up-email-parent'>
                        <input id='sign-up-email-input' name='email' placeholder='email' />
                    </div>
                    {emailStatus}
                    <div id='sign-up-password-parent'>
                        <input id='sign-up-password-input' name='password' placeholder='password' />
                    </div>
                    {passwordStatus}
                </form>
            </div>
        </div>
    )
}

export { SignUp }