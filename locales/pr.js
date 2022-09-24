const pr = {
    main: {
        welcome: {
            title: "Bem-vindo ao aplicativo!",

            navbar: {
                login: "Entrar",
                register: "Registrar",
                about: "Acerca",
                support: "Suporte",
                download: "Baixar",
            },
        },
        home: {
            pageTitle: "DIMLIM | Casa",
            title: "Casa",

            navbar: {
                profile: "Perfil",
                settings: "Configurações",

                logout: "Sair",
            },

            contacts: "Contatos",
            blocked: "Bloqueado",

            addContact: "Adicionar contato",
            noContacts: "Você ainda não tem nenhum contato, comece pressionando Adicionar contato",

            blockedContacts: "Contatos bloqueados",
            noBlockedContacts: "Você ainda não tem nenhum contato bloqueado",

            newMessageNotification: "Nova mensagem",

            dialogs: {
                addContact: {
                    title: "Adicionar contato",
                    label: "Por favor, insira o nome de usuário da pessoa",

                    cancel: "Cancelar",
                    add: "Adicionar",

                    "missing-parameters": "Por favor, preencha todas as entradas.",
                    "self-add": "Você não pode se adicionar como contato",
                    "already-on-list": "Esse usuário já está em seus contatos.",
                    "user-not-found": "Não há usuário com esse nome de usuário",
                },
            },
        },
    },
    accounts: {
        login: {
            pageTitle: "DIMLIM | Login",
            title: "Entrar no DIMLIM",

            email: "Email",
            password: "Senha",
            tfa: "Autenticação de dois fatores",

            login: "Entrar",
            submit: "Enviar",
            forgotPassword: "Esqueceu sua senha?",
            doNotHaveAnAccount: "Ainda não tem uma conta? & Registre-se",
            tfaHelp: "Vá para seu aplicativo de autenticação e insira o código de 6 dígitos ou insira um de seus códigos de backup",

            emailRequired: "O e-mail é obrigatório.",
            passwordRequired: "A senha é obrigatória.",
            emailInvalid: "Email inválido.",
            emailOrPasswordIncorrect: "Email ou senha incorretos.",
            rateLimitExceeded: "Muitas tentativas de login, tente novamente mais tarde.",
            invalidTfa: "Código TFA inválido, tente novamente.",

            navbar: {
                login: "Entrar",
                register: "Registrar",
                about: "Acerca",
                support: "Suporte",
                download: "Baixar",
            },
        },
        register: {
            pageTitle: "DIMLIM | Cadastro",
            title: "Registrar no DIMLIM",

            email: "Email",
            username: "Nome de usuário",
            password: "Senha",
            confirmPassword: "Confirmar Senha",

            register: "Registrar",
            alreadyHaveAnAccount: "Já tem uma conta? & Login",

            emailRequired: "Email obrigatório",
            usernameRequired: "O nome de usuário é obrigatório",
            passwordRequired: "A senha é obrigatória",
            confirmPasswordRequired: "Por favor, confirme sua senha",

            emailInvalid: "Email inválido",
            usernameInvalid: "Os nomes de usuário podem conter apenas letras, números e pontos (.)",
            usernameLength: "O nome de usuário deve ter entre 3 e 32 caracteres",
            passwordLength: "A senha deve ter entre 8 e 256 caracteres",

            usernameInUse: "O nome de usuário já está em uso",
            emailInUse: "Email já está em uso",
            rateLimitExceeded: "Você já registrou uma conta recentemente, tente novamente mais tarde",

            navbar: {
                login: "Entrar",
                register: "Registrar",
                about: "Acerca",
                support: "Suporte",
                download: "Baixar",
            },
        },
        verifyEmail: {
            pageTitle: "DIMLIM | Verificar e-mail",

            expired: "O código expirou.",
            invalid: "O código que você digitou é inválido.",
            successNotLoggedIn: "Seu e-mail foi verificado, agora você pode fazer login em sua conta.",
            successLoggedIn: "Seu e-mail foi verificado.",

            entrar: "Entrar",
            goHome: "Ir para casa",

            navbar: {
                login: "Entrar",
                register: "Registrar",
                about: "Acerca",
                support: "Suporte",
                download: "Baixar",

                profile: "Perfil",
                settings: "Configurações",

                logout: "Sair",
            },
        },
    },
    settings: {
        index: {
            pageTitle: "DIMLIM | Configurações",
            title: "Configurações DIMLIM",

            navbar: {
                profile: "Perfil",
                settings: "Configurações",

                logout: "Sair",
            },

            tabs: {
                general: "Geral",
                security: "Segurança",
                privacy: "Privazio",
                account: "Conta",
            },

            general: {
                title: "Informações Gerais",
                username: "Nome de usuário:",
                bio: "Bio:",
                email: "Email:",
                preferredLanguage: "Idioma preferido:",
                contacts: "Contatos:",
                blockedContacts: "Contatos bloqueados:",
                creation: "Data de criação da conta:",

                locales: {
                    de: "Deutsch",
                    en: "English",
                    es: "Español",
                    fr: "Français",
                    pr: "Português",
                },

                dialogs: {
                    avatar: {
                        title: "Deseja usar esta imagem como seu avatar?",
                        cancel: "Cancelar",
                        yes: "Sim",
                    },
                    email: {
                        title: "Por favor, insira seu novo e-mail",
                        subTitle: "Este e-mail não será verificado e você terá que passar pelo processo de re-verificação de seu e-mail",

                        newEmail: "Seu novo e-mail",
                        password: "Sua senha atual",

                        cancel: "Cancelar",
                        yes: "Sim",

                        missing: "Por favor, preencha todas as entradas",
                        invalidEmail: "O e-mail que você digitou é inválido",

                        "email-already-in-use": "O e-mail que você digitou já está em uso",
                        "user-not-found": "Certo amigo como diabos você está fazendo isso então, eu nem vou me incomodar",
                        "rate-limit-exceeded": "Você tentou alterar seu e-mail muitas vezes, tente novamente mais tarde.",
                    },
                    language: {
                        title: "Por favor, selecione um idioma",
                        subTitle: "Isso definirá o idioma do aplicativo",

                        cancel: "Cancelar",
                        change: "Alterar idioma",
                    },
                    bio: {
                        title: "Por favor, insira sua nova biografia",
                        cancel: "Cancelar",
                        change: "Alterar biografia",
                    },
                },
            },
            security: {
                password: "Senha",
                tfa: "Autenticação de dois fatores",

                tfaActive: "Ativo",
                tfaNotActive: "Não configurado",

                dialogs: {
                    password: {
                        title: "Alterar senha",
                        old: "Sua senha antiga",
                        new: "Sua nova senha",
                        tfa: "Código TFA/Código de Backup",

                        cancel: "Cancelar",
                        change: "Alterar senha",

                        unauthorized: "Senha inválida.",
                        "missing-parameters": "Por favor, preencha todas as entradas.",
                        "invalid-parameters": "Sua nova senha deve ter mais de 8 caracteres e menos de 256 caracteres.",
                        "invalid-tfa-code": "Código TFA inválido, tente novamente.",
                        "rate-limit-exceeded": "Você tentou alterar sua senha muitas vezes, tente novamente mais tarde.",
                    },
                    setupTfa: {
                        title: "Autenticação de dois fatores",
                        subTitle: "TFA adiciona uma camada extra de segurança na qual você também precisa de um dispositivo para fazer login em sua conta.",
                        deactivateLabel: "Código TFA/Código de Backup",

                        emailVerified: "Você precisa verificar seu e-mail para habilitar o TFA",

                        activate: "Ativar",
                        deactivate: "Desativar",
                        cancel: "Cancelar",
                        ok: "Ok",

                        "missing-parameters": "Por favor, preencha todas as entradas.",
                        "invalid-tfa-code": "Código TFA inválido, tente novamente.",
                        "rate-limit-exceeded": "Você tentou desativar o TFA muitas vezes, tente novamente mais tarde.",
                    },
                    activateTfa: {
                        title: "Autenticação de dois fatores",
                        warning:
                            "CERTIFIQUE-SE DE INSERIR O CÓDIGO NO SEU APLICATIVO TFA, VOCÊ NÃO VERÁ ESTE CÓDIGO NOVAMENTE, SE VOCÊ PERDER, PERDE SUA CONTA",
                        done: "Feito",
                    },
                    backupTfa: {
                        title: "Autenticação de dois fatores",
                        subTitle: "Para confirmar e obter seus códigos de backup, insira um código gerado pelo seu aplicativo TFA",
                        warning:
                            "Estes são seus códigos de backup, se você perder seu dispositivo, você pode usar esses códigos para recuperar sua conta, você não os verá novamente, então salve-os em algum lugar seguro.",

                        done: "Feito",
                        enviar: "Enviar",

                        "missing-parameters": "Por favor, preencha todas as entradas.",
                        "invalid-tfa-code": "Código TFA inválido, tente novamente.",
                        "rate-limit-exceeded": "Você tentou desativar o TFA muitas vezes, tente novamente mais tarde.",
                    },
                },
            },
            account: {
                emailStatus: "Status do e-mail",
                emailVerified: "Email verificado",
                emailNotVerified: "Email não verificado",

                logout: "Sair",
                logoutDesc: "Suas mensagens serão deletadas",

                deleteAccount: "Excluir conta",
                deleteAccountDesc: "Excluir tudo em sua conta",

                dialogs: {
                    verifyEmail: {
                        title: "Verifique seu e-mail",
                        subTitle: "Verifique seu e-mail para ativar o TFA e receber atualizações de segurança diretamente em seu e-mail.",

                        verify: "Verificar",
                        cancel: "Cancelar",
                    },
                    verificationEmailSent: {
                        title: "verifique seu e-mail",
                        subTitle: "Enviamos um e-mail para & com um código, ele expira em 5 horas.",
                        ok: "Ok",
                    },
                    logout: {
                        title: "Sair",
                        warning: "Todas as suas mensagens serão deletadas por motivos de segurança.",
                        cancel: "Cancelar",
                    },
                    deleteAccount: {
                        title: "Excluir conta",
                        warning: "Você não poderá recuperar sua conta depois disso, prossiga com cuidado.",

                        password: "Senha",
                        tfaCode: "Código TFA/Código de Backup",

                        cancel: "Cancelar",

                        "missing-parameters": "Por favor, preencha todas as entradas.",
                        "rate-limit-exceeded": "Você tentou excluir sua conta muitas vezes, tente novamente mais tarde.",
                        "invalid-tfa-code": "Código TFA inválido",
                        unauthorized: "Senha inválida",
                    },
                },
            },
        },
    },
    chat: {
        index: {
            intro: "Este é o início do seu chat",
            placeholder: "Mensagem...",

            dialogs: {
                profile: {
                    done: "Pronto",
                },
                block: {
                    warning: "Você não receberá mais as mensagens deles e eles não poderão convidá-lo para bate-papos em grupo",
                    block: "Bloquear",
                    cancel: "Cancelar",
                },
                delete: {
                    title: "Excluir bate-papo",
                    warning: "Isso não pode ser desfeito",
                    delete: "Excluir",
                    cancel: "Cancelar",
                },
                attachment: {
                    title: "Enviar arquivo",
                    warning: "Tem certeza de que deseja enviar este arquivo para",
                    noPreview: "Não é possível mostrar a visualização deste tipo de arquivo",

                    cancel: "Cancelar",
                    send: "Enviar",
                },
                attachmentTooBig: {
                    title: "Enviar arquivo",
                    message: "O arquivo que você selecionou é muito grande, deve ter menos de 10mb",
                    ok: "Ok",
                },
            },

            navbar: {
                block: "Bloquear",
                delete: "Excluir bate-papo"
            }
        },
    },
};

module.exports = pr;
