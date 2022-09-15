const fr = {
    main: {
        welcome: {
            title: "Bienvenue sur l'application!",

            navbar: {
                login: "Connexion",
                register: "S'inscrire",
                about: "À propos de",
                support: "Soutien",
                download: "Télécharger",
            },
        },
        home: {
            title: "Page d'accueil",

            navbar: {
                profile: "Profil",
                settings: "Réglages",

                logout: "Se déconnecter",
            },
        },
    },
    accounts: {
        login: {
            pageTitle: "DIMLIM | Connexion",
            title: "Connectez-vous à DIMLIM",

            email: "Email",
            password: "Mot de passe",
            tfa: "Authentification à deux facteurs",

            login: "Connexion",
            submit: "Soumettre",
            forgotPassword: "Mot de passe oublié?",
            doNotHaveAnAccount: "Vous n'avez pas encore de compte? & S'inscrire",
            tfaHelp: "Accédez à votre application d'authentification et insérez le code à 6 chiffres, ou insérez l'un de vos codes de secours",

            emailRequired: "Un email est requis.",
            passwordRequired: "Mot de passe requis.",
            emailInvalid: "Le courriel est invalide.",
            emailOrPasswordIncorrect: "Email ou mot de passe incorrect.",
            rateLimitExceeded: "Trop de tentatives de connexion, veuillez réessayer plus tard.",
            invalidTfa: "Code TFA invalide, veuillez réessayer.",

            navbar: {
                login: "Connexion",
                register: "S'inscrire",
                about: "À propos de",
                support: "Soutien",
                download: "Télécharger",
            },
        },
        register: {
            pageTitle: "DIMLIM | S'inscrire",
            title: "Inscrivez-vous dans DIMLIM",

            email: "Email",
            username: "Nom d'utilisateur",
            password: "Mot de passe",
            confirmPassword: "Confirmez le mot de passe",

            register: "S'inscrire",
            alreadyHaveAnAccount: "Vous avez déjà un compte? & Connexion",

            emailRequired: "L'email est requis",
            usernameRequired: "Nom d'utilisateur est nécessaire",
            passwordRequired: "Mot de passe requis",
            confirmPasswordRequired: "Veuillez confirmer votre mot de passe",

            emailInvalid: "Email est invalide",
            usernameInvalid: "Les noms d'utilisateur ne peuvent contenir que des lettres, des chiffres et des points (.)",
            usernameLength: "Le nom d'utilisateur doit être compris entre 3 et 32 caractères",
            passwordLength: "Le mot de passe doit comporter entre 8 et 256 caractères",

            usernameInUse: "Nom d'utilisateur est déjà utilisé",
            emailInUse: "Cet email est déjà utilisé",
            rateLimitExceeded: "Vous avez déjà enregistré un compte récemment, veuillez réessayer plus tard",

            navbar: {
                login: "Connexion",
                register: "S'inscrire",
                about: "À propos de",
                support: "Soutien",
                download: "Télécharger",
            },
        },
    },
    settings: {
        index: {
            pageTitle: "DIMLIM | Réglages",
            title: "DIMLIM Réglages",

            navbar: {
                profile: "Profil",
                settings: "Réglages",

                logout: "Se déconnecter",
            },
        },
    },
};

module.exports = fr;
