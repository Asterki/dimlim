const en = {
    main: {
        welcome: {
            title: "Welcome to the app!",
        },
        home: {
            title: "Home",
        },
    },
    accounts: {
        login: {
            pageTitle: "DIMLIM | Login",
            title: "Login into Dispatch",

            email: "Email",
            password: "Password",

            login: "Login",
            forgotPassword: "Forgot Your Password?",
            doNotHaveAnAccount: "Don't have an account yet? & Register",

            emailRequired: "Email is required",
            passwordRequired: "Password is required",
            emailInvalid: "Email is invalid",
            emailOrPasswordIncorrect: "Email or password is incorrect",
            rateLimitExceeded: "Too many login attempts. Please try again later.",
        },
        register: {
            pageTitle: "DIMLIM | Register",
            title: "Register into DIMLIM",

            email: "Email",
            username: "Username",
            password: "Password",
            confirmPassword: "Confirm Password",

            register: "Register",
            alreadyHaveAnAccount: "Already have an account? & Login",

            emailRequired: "Email is required",
            usernameRequired: "Username is required",
            passwordRequired: "Password is required",
            confirmPasswordRequired: "Please confirm your password",

            emailInvalid: "Email is invalid",
            usernameInvalid: "Usernames can only contain letters, numbers, and dots (.)",
            usernameLength: "Username must be between 3 and 32 characters",
            passwordLength: "Password must be between 8 and 256 characters",

            usernameInUse: "Username is already in use",
            emailInUse: "Email is already in use",
            rateLimitExceeded: "You already registered an account recently, please try again later",
        },
    },
};

module.exports = en;
