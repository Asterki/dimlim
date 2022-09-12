const es = {
    main: {
        welcome: {
            title: "Bienvenido a la app!",
            
            navbar: {
                login: "Iniciar sesión",
                register: "Registrarse",
                about: "Acerca de",
                support: "Soporte",
                download: "Descarga",
            },
        },
        home: {
            title: "Inicio",

            navbar: {
                profile: "Perfil",
                settings: "Configuración",

                logout: "Cerrar sesión",
            },
        },
    },
    accounts: {
        login: {
            pageTitle: "DIMLIM | Iniciar sesión",
            title: "Iniciar sesión en DIMLIM",

            email: "Correo electrónico",
            password: "Contraseña",
            tfa: "Autentificación de dos factores",

            login: "Iniciar sesión",
            submit: "Enviar",
            forgotPassword: "¿Has olvidado la contraseña?",
            doNotHaveAnAccount: "¿Aún no tienes una cuenta?, Registrate",
            tfaHelp: "Vaya a su aplicación de autentificación e inserte el código de 6 dígitos, o inserte uno de sus códigos de respaldo",

            emailRequired: "El correo electrónico es requerido.",
            passwordRequired: "La contraseña es requerida.",
            emailInvalid: "Correo electrónico inválido.",
            emailOrPasswordIncorrect: "El correo electrónico o la contraseña son incorrectos.",
            rateLimitExceeded: "Demasiados intentos de inicio de sesión, por favor inténtelo más tarde.",
            invalidTfa: "Codigo TFA inválido, por favor inténtelo más tarde.",

            navbar: {
                login: "Iniciar sesión",
                register: "Registrarse",
                about: "Acerca de",
                support: "Soporte",
                download: "Descarga",
            },
        },
        register: {
            pageTitle: "DIMLIM | Registrarse",
            title: "Registrarse en DIMLIM",

            email: "Correo electrónico",
            username: "Nombre de usuario",
            password: "Contraseña",
            confirmPassword: "Confirma la contraseña",

            register: "Registrarse",
            alreadyHaveAnAccount: "¿Ya tienes una cuenta?, Inicia sesión",

            emailRequired: "El correo electrónico es requerido",
            usernameRequired: "El nombre de usuario es requerido",
            passwordRequired: "La contraseña es requerida",
            confirmPasswordRequired: "Por favor confirma tu contraseña",

            emailInvalid: "El correo electrónico es inválido",
            usernameInvalid: "Los nombres de usuario solo pueden contener: letras, números, y puntos (.)",
            usernameLength: "El nombre de usuario debe tener entre 3 y 32 caracteres",
            passwordLength: "La contraseña debe tener entre 8 y 256 caracteres",

            usernameInUse: "El nombre de usuario ya está en uso",
            emailInUse: "El correo electrónico ya está en uso",
            rateLimitExceeded: "Ya registraste una cuenta recientemente, inténtelo de nuevo más tarde",

            navbar: {
                login: "Iniciar sesión",
                register: "Registrarse",
                about: "Acerca de",
                support: "Soporte",
                download: "Descarga",
            },
        },
    },
    settings: {
        index: {
            pageTitle: "DIMLIM | Configuración",
            title: "DIMLIM Configuración",

            navbar: {
                profile: "Perfil",
                settings: "Configuración",

                logout: "Cerrar sesión",
            },
        },
    },
};

module.exports = es;
