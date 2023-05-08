import { LangPack } from "shared/types/lang";

const es: LangPack = {
    main: {
        welcome: {
            title: "¡Bienvenido a la aplicación!",

            security: "Seguridad",
            securityDesc: "DIMLIM utiliza cifrado de extremo a extremo para enviar mensajes y archivos",

            privacy: "Privacidad",
            privacyDesc:
                "DIMLIM no recopila ningún dato de usuario o mensaje, nuestro código es de código abierto, por lo que puede consultarlo en cualquier momento",

            velocity: "Velocidad",
            velocityDesc: "DIMLIM utiliza el marco Next.js, que ofrece una navegación rápida",

            navbar: {
                login: "Iniciar sesión",
                register: "Registrarse",
            },
        },
        home: {
            pageTitle: "DIMLIM | Página principal",
            title: "Página principal",

            navbar: {
                profile: "Perfil",
                settings: "Ajustes",

                logout: "Cerrar sesión",
            },

            contacts: "Contactos",
            blocked: "Bloqueados",

            addContact: "Añadir contactos",
            noContacts: "Todavía no tienes contactos, presiona Añadir Contactos para añadir un contacto",

            blockedContacts: "Contactos Bloqueados",
            noBlockedContacts: "Todavía no tienes contactos bloqueados",

            newMessageNotification: "Nuevo Mensaje",

            dialogs: {
                addContact: {
                    title: "Añadir contacto",
                    label: "Porfavor ingresa el nombre de usuario de la persona",

                    cancel: "Cancelar",
                    add: "Añadir",

                    "missing-parameters": "Complete todas las entradas.",
                    "self-add": "No puedes agregarte como contacto.",
                    "already-on-list": "Ese usuario ya está en tus contactos.",
                    "user-not-found": "No hay ningún usuario con ese nombre de usuario",
                },
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
            doNotHaveAnAccount: "¿Aún no tienes una cuenta? & Registrate",
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
            alreadyHaveAnAccount: "¿Ya tienes una cuenta? & Inicia sesión",

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
            rateLimitExceeded: "Ya se registró una cuenta recientemente, inténtelo de nuevo más tarde",

            navbar: {
                login: "Iniciar sesión",
                register: "Registrarse",
                about: "Acerca de",
                support: "Soporte",
                download: "Descarga",
            },
        },
        verifyEmail: {
            pageTitle: "DIMLIM | Verificar correo electrónico",

            expired: "El código ha caducado.",
            invalid: "El código que ingresaste no es válido.",
            successNotLoggedIn: "Su correo electrónico ha sido verificado, ahora puede iniciar sesión en su cuenta.",
            successLoggedIn: "Su correo electrónico ha sido verificado.",

            login: "Iniciar sesión",
            goHome: "Ir a la página principal",

            navbar: {
                login: "Iniciar sesión",
                register: "Registrarse",
                about: "Acerca de",
                support: "soporte",
                download: "Descargar",

                profile: "Perfil",
                settings: "Configuración",

                logout: "Cerrar sesión",
            },
        },
    },
    settings: {
        index: {
            pageTitle: "DIMLIM | Configuración",
            title: "Configuración DIMLIM",

            navbar: {
                profile: "Perfil",
                settings: "Configuración",

                logout: "Cerrar sesión",
            },

            tabs: {
                general: "General",
                security: "Seguridad",
                privacy: "Privacidad",
                account: "Cuenta",
            },

            general: {
                title: "Información general",
                username: "Nombre de usuario:",
                bio: "Biografía:",
                email: "Correo electrónico:",
                preferredLanguage: "Idioma preferido:",
                contacts: "Contactos:",
                blockedContacts: "Contactos bloqueados:",
                creation: "Fecha de creación de la cuenta:",

                locales: {
                    de: "Deutsch",
                    en: "English",
                    es: "Español",
                    fr: "Français",
                    pr: "Português",
                },

                dialogs: {
                    avatar: {
                        title: "¿Quieres usar esta imagen como tu avatar?",
                        cancel: "Cancelar",
                        yes: "Sí",
                    },
                    email: {
                        title: "Inserte su nuevo correo electrónico",
                        subTitle: "Este correo electrónico no se verificará y deberá pasar por el proceso de volver a verificar su correo electrónico",

                        newEmail: "Tu nuevo correo electrónico",
                        password: "Tu contraseña actual",

                        cancel: "Cancelar",
                        yes: "Sí",

                        missing: "Por favor complete todas las entradas.",
                        invalidEmail: "El correo electrónico que ingresó no es válido.",

                        "email-already-in-use": "El correo electrónico que ingresaste ya está en uso.",
                        "user-not-found": "Bueno, amigo, ¿cómo diablos estás haciendo esto entonces? Ni siquiera me voy a molestar",
                        "rate-limit-exceeded": "Ha intentado cambiar su correo electrónico demasiadas veces, vuelva a intentarlo más tarde.",
                    },
                    language: {
                        title: "Seleccione un idioma",
                        subTitle: "Esto establecerá el idioma de la aplicación",

                        cancel: "Cancelar",
                        change: "Cambiar idioma",
                    },
                    bio: {
                        title: "Por favor, inserte su nueva biografía",
                        cancel: "Cancelar",
                        change: "Cambiar biografía",
                    },
                },
            },
            security: {
                password: "Contraseña",
                tfa: "Autenticación de dos factores",

                tfaActive: "Activo",
                tfaNotActive: "No configurado",

                dialogs: {
                    password: {
                        title: "Cambiar contraseña",
                        old: "Tu antigua contraseña",
                        new: "Tu nueva contraseña",
                        tfa: "Código TFA/Código de respaldo",

                        cancel: "Cancelar",
                        change: "Cambiar contraseña",

                        unauthorized: "Contraseña no válida.",
                        "missing-parameters": "Por favor complete todas las entradas.",
                        "invalid-parameters": "Tu nueva contraseña debe tener más de 8 caracteres y menos de 256 caracteres.",
                        "invalid-tfa-code": "Código TFA no válido, inténtalo de nuevo.",
                        "rate-limit-exceeded": "Ha intentado cambiar su contraseña demasiadas veces, vuelva a intentarlo más tarde.",
                    },
                    setupTfa: {
                        title: "Autenticación de dos factores",
                        subTitle: "TFA agrega una capa adicional de seguridad en la que también necesita un dispositivo para iniciar sesión en su cuenta.",
                        deactivateLabel: "Código TFA/Código de respaldo",

                        emailVerified: "Necesita verificar su correo electrónico para habilitar TFA",

                        activate: "Activar",
                        deactivate: "Desactivar",
                        cancel: "Cancelar",
                        ok: "Ok",

                        "missing-parameters": "Por favor complete todas las entradas.",
                        "invalid-tfa-code": "Código TFA no válido, inténtalo de nuevo.",
                        "rate-limit-exceeded": "Ha intentado desactivar TFA demasiadas veces, vuelva a intentarlo más tarde.",
                    },
                    activateTfa: {
                        title: "Autenticación de dos factores",
                        warning: "ASEGÚRESE DE INGRESAR EL CÓDIGO A SU APLICACIÓN TFA, NO VOLVERÁ A VER ESTE CÓDIGO, SI LO PIERDE, PERDERÁ SU CUENTA",
                        done: "Hecho",
                    },
                    backupTfa: {
                        title: "Autenticación de dos factores",
                        subTitle: "Para confirmar y obtener sus códigos de respaldo, inserte un código generado por su aplicación TFA",
                        warning:
                            "Estos son sus códigos de respaldo, si pierde su dispositivo, puede usar estos códigos para recuperar su cuenta, no los volverá a ver, así que guárdelos en un lugar seguro.",

                        done: "Hecho",
                        submit: "Enviar",

                        "missing-parameters": "Por favor complete todas las entradas.",
                        "invalid-tfa-code": "Código TFA no válido, inténtalo de nuevo.",
                        "rate-limit-exceeded": "Ha intentado desactivar TFA demasiadas veces, vuelva a intentarlo más tarde.",
                    },
                },
            },
            account: {
                emailStatus: "Estado del correo electrónico",
                emailVerified: "Correo electrónico verificado",
                emailNotVerified: "Correo electrónico no verificado",

                logout: "Cerrar sesión",
                logoutDesc: "Tus mensajes serán eliminados",

                deleteAccount: "Borrar cuenta",
                deleteAccountDesc: "Borrar todo en tu cuenta",

                dialogs: {
                    verifyEmail: {
                        title: "Verifica tu correo electrónico",
                        subTitle:
                            "Verifique su correo electrónico para activar TFA y recibir actualizaciones de seguridad, directamente en su correo electrónico.",

                        verify: "Verificar",
                        cancel: "Cancelar",
                    },
                    verificationEmailSent: {
                        title: "verifica tu correo electrónico",
                        subTitle: "Hemos enviado un correo electrónico a & con un código, caducará en 5 horas.",
                        ok: "Ok",
                    },
                    logout: {
                        title: "Cerrar sesión",
                        warning: "Todos tus mensajes serán eliminados por razones de seguridad.",
                        cancel: "Cancelar",
                    },
                    deleteAccount: {
                        title: "Eliminar cuenta",
                        warning: "No podrá recuperar su cuenta después de esto, proceda con precaución.",

                        password: "Contraseña",
                        tfaCode: "Código TFA/Código de respaldo",

                        cancel: "Cancelar",

                        "missing-parameters": "Por favor complete todas las entradas.",
                        "rate-limit-exceeded": "Intentaste eliminar tu cuenta demasiadas veces, vuelve a intentarlo más tarde.",
                        "invalid-tfa-code": "Código TFA no válido",
                        unauthorized: "Contraseña no válida",
                    },
                },
            },
        },
    },
    chat: {
        index: {
            intro: "Este es el comienzo de tu chat",
            placeholder: "Mensaje...",

            dialogs: {
                profile: {
                    done: "Listo",
                },
                block: {
                    warning: "No vas a recivir sus mensajes y no van a poder invitarte a grupos de chat",
                    block: "Bloquear",
                    cancel: "Cancelar",
                },
                delete: {
                    title: "Borrar Chat",
                    warning: "Esto no es reversible",
                    delete: "Borrar",
                    cancel: "Cancelar",
                },
                attachment: {
                    title: "Enviar Archivo",
                    warning: "Quieres enviar este archivo a",
                    noPreview: "No se puede mostrar la previsualización de este tipo de archivo",

                    cancel: "Cancelar",
                    send: "Enviar",
                },
                attachmentTooBig: {
                    title: "Enviar Archivo",
                    message: "El archivo que seleccionaste es muy pesado, tiene que pesar menos de 10MB",
                    ok: "Ok",
                },
            },

            navbar: {
                block: "Bloquear",
                delete: "Borrar Chat",
            },
        },
    },
};

export default es;
