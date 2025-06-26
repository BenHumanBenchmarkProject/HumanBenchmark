import "./SignInModal.css"


const SignInModal = () => {
    return(
        <div className="signin-container">
            <h1>Sign In</h1>
            <form className="signin-form">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" />

                <button>Sign In</button>
            </form>
        </div>
    )
}

export default SignInModal;
