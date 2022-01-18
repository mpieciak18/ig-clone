import '../styles/pages/SignUp.css'
import { Navbar } from '../components/Navbar'
import { UsernameFooter } from '../components/SignUp/UsernameFooter.js'
import { PasswordFooter } from '../components/SignUp/PasswordFooter.js'
import { NameFooter } from '../components/SignUp/NameFooter'
import { newUser } from '../firebase/users.js'

const SignUp = (props) => {
    const { user } = props
    const [usernamePasses, setUsernamePasses] = useState(false)
    const [namePasses, setNamePasses] = useState(false)
    const [passwordPasses, setPasswordPasses] = useState(false)
    const [emailPasses, setEmailPasses] = useState(false)
    const allPass = () => {
        return (
            usernamePasses == true && 
            namePasses == true &&
            passwordPasses == true && 
            emailPasses == true
        )
    }

    const newSignUp = async (e) => {
        const username = e.target.username.value
        const name = e.target.name.value
        const email = e.target.email.value
        const password = e.target.password.value
        await newUser(username, name, email, password)
    }

    const signUpButton = () => {
        if (allPass() == true) {
            return (
                <button type='submit' id='sign-up-form-button' className='active'>
                    Sign Up
                </button>
            )
        } else {
            return (
                <button type='button' id='sign-up-form-button' className='inactive'>
                    Sign Up
                </button>
            )
        }
    }

    return (
        <div id="sign-up" className="page">
            <Navbar user={user} />
            <div id='sign-up-parent'>
                <form id='sign-up-form' onSubmit={newSignUp}>
                    <div id='sign-up-header'>
                        <img id='sign-up-logo' />
                        <div id='sign-up-title'>Sign Up</div>
                    </div>
                    <div id='sign-up-username-parent'>
                        <div id='sign-up-username-symbol'>@</div>
                        <div id='sign-up-username-divider' />
                        <input id='sign-up-username-input' name='username' placeholder='username' onChange={updateUsername} />
                    </div>
                    <UsernameFooter eventHandler={() => setUsernamePasses} />
                    <div id='sign-up-name-parent'>
                        <input id='sign-up-name-input' name='name' placeholder='your real name' />
                    </div>
                    <NameFooter eventHandler={() => setNamePasses} />
                    <div id='sign-up-email-parent'>
                        <input id='sign-up-email-input' name='email' placeholder='email' />
                    </div>
                    <EmailFooter eventHandler={() => setEmailPasses} />
                    <div id='sign-up-password-parent'>
                        <input id='sign-up-password-input' name='password' placeholder='password' />
                    </div>
                    <PasswordFooter eventHandler={() => setPasswordPasses} />
                    {signUpButton}
                </form>
            </div>
        </div>
    )
}

export { SignUp }