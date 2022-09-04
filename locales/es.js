const es = {
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
            pageTitle: "DIMLIM | Iniciar sesión",
            title: "Iniciar sesión en DIMLIM",

            email: "Correo electrónico",
            password: "Comtraseña",

            login: "Ingresar",
            forgotPassword: "¿Olvidó su contraseña?",
            doNotHaveAnAccount: "¿Aún no tienes una cuenta? & Regístrese",

            emailRequired: "El correo electrónico es obligatorio",
            passwordRequired: "Se requiere contraseña",
            emailInvalid: "El correo electrónico no es válido",
            emailOrPasswordIncorrect: "El correo electrónico o la contraseña son incorrectos",
            rateLimitExceeded: "Demasiados intentos de inicio de sesión. Vuelva a intentarlo más tarde",
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

module.exports = es;
