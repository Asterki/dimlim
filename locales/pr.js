const pr = {
    main: {
        welcome: {
            title: "Bem-vindo ao aplicativo!",

            navbar: {
                login: "Conecte-se",
                register: "Registro",
                about: "Sobre",
                support: "Apoiar",
                download: "Download",
            },
        },
        home: {
            title: "Página principal",

            navbar: {
                profile: "Perfil",
                settings: "Definições",

                logout: "Sair",
            },
        },
    },
    accounts: {
        login: {
            pageTitle: "DIMLIM | Conecte-se",
            title: "Entrar em DIMLIM",

            email: "Email",
            password: "Senha",
            tfa: "Autenticação de dois fatores",

            login: "Conecte-se",
            submit: "Registrarse",
            forgotPassword: "Esqueceu sua senha?",
            doNotHaveAnAccount: "Não tem uma conta ainda? & Registro",
            tfaHelp: "Acesse seu aplicativo de autenticação e insira o código de 6 dígitos ou insira um de seus códigos de backup",

            emailRequired: "O email é obrigatório.",
            passwordRequired: "Senha requerida.",
            emailInvalid: "Email inválido.",
            emailOrPasswordIncorrect: "Email ou senha está incorreto.",
            rateLimitExceeded: "Muitas tentativas de login, tente novamente mais tarde.",
            invalidTfa: "Código TFA inválido. Tente novamente.",

            navbar: {
                login: "Conecte-se",
                register: "Registro",
                about: "Sobre",
                support: "Apoiar",
                download: "Download",
            },
        },
        register: {
            pageTitle: "DIMLIM | Registro",
            title: "Registre-se no DIMLIM",

            email: "Email",
            username: "Nome de usuário",
            password: "Senha",
            confirmPassword: "Confirme a Senha",

            register: "Registro",
            alreadyHaveAnAccount: "já tem uma conta? & Conecte-se",

            emailRequired: "O e-mail é obrigatório",
            usernameRequired: "Nome de usuário é requerido",
            passwordRequired: "Senha requerida",
            confirmPasswordRequired: "Por favor, confirme sua senha",

            emailInvalid: "Email inválido",
            usernameInvalid: "Os nomes de usuário podem conter apenas letras, números e pontos (.)",
            usernameLength: "O nome de usuário deve ter entre 3 e 32 caracteres",
            passwordLength: "A senha deve ter entre 8 e 256 caracteres",

            usernameInUse: "O nome de usuário já está em uso",
            emailInUse: "O email já está sendo usado",
            rateLimitExceeded: "Você já registrou uma conta recentemente, tente novamente mais tarde",

            navbar: {
                login: "Conecte-se",
                register: "Registro",
                about: "Sobre",
                support: "Apoiar",
                download: "Download",
            },
        },
    },
    settings: {
        index: {
            pageTitle: "DIMLIM | Definições",
            title: "DIMLIM Definições",

            navbar: {
                profile: "Perfil",
                settings: "Definições",

                logout: "Sair",
            },
        },
    },
};

module.exports = pr;
