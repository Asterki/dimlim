const en = {
    main: {
        welcome: {
            title: "Welcome to the app!",

            navbar: {
                login: "Login",
                register: "Register",
                about: "About",
                support: "Support",
                download: "Download",
            },
        },
        home: {
            title: "Home",

            navbar: {
                profile: "Profile",
                settings: "Settings",

                logout: "Logout",
            },
        },
    },
    accounts: {
        login: {
            pageTitle: "DIMLIM | Login",
            title: "Login into DIMLIM",

            email: "Email",
            password: "Password",
            tfa: "Two Factor Authentication",

            login: "Login",
            submit: "Submit",
            forgotPassword: "Forgot Your Password?",
            doNotHaveAnAccount: "Don't have an account yet? & Register",
            tfaHelp: "Go to your authentication app and insert the 6 digit code",

            emailRequired: "Email is required.",
            passwordRequired: "Password is required.",
            emailInvalid: "Email is invalid.",
            emailOrPasswordIncorrect: "Email or password is incorrect.",
            rateLimitExceeded: "Too many login attempts, please try again later.",
            invalidTfa: "Invalid TFA code, please try again.",

            navbar: {
                login: "Login",
                register: "Register",
                about: "About",
                support: "Support",
                download: "Download",
            },
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

            navbar: {
                login: "Login",
                register: "Register",
                about: "About",
                support: "Support",
                download: "Download",
            },
        },
    },
    settings: {
        index: {
            pageTitle: "DIMLIM | Settings",
            title: "DIMLIM Settings",

            navbar: {
                profile: "Profile",
                settings: "Settings",

                logout: "Logout",
            },
        },
    },
};

module.exports = en;
