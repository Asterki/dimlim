const de = {
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
            pageTitle: "DIMLIM | Startseite",
            title: "Zuhause",

            navbar: {
                profile: "Profil",
                settings: "Einstellungen",

                logout: "Abmelden",
            },

            contacts: "Kontakte",
            blocked: "Blockiert",

            addContact: "Kontakt hinzufügen",
            noContacts: "Sie haben noch keine Kontakte, beginnen Sie mit Kontakt hinzufügen",

            blockedContacts: "Blockierte Kontakte",
            noBlockedContacts: "Du hast noch keine blockierten Kontakte",

            dialogs: {
                addContacts: {
                    title: "Kontakt hinzufügen",
                    label: "Bitte geben Sie den Benutzernamen der Person ein",

                    cancel: "Abbrechen",
                    add: "Hinzufügen",

                    "missing-parameters": "Bitte füllen Sie alle Eingaben aus.",
                    "self-add": "Sie können sich selbst nicht als Kontakt hinzufügen",
                    "already-on-list": "Dieser Benutzer ist bereits in Ihren Kontakten.",
                    "user-not-found": "Es gibt keinen Benutzer mit diesem Benutzernamen",
                },
            },
        },
    },
    accounts: {
        login: {
            pageTitle: "DIMLIM | Anmeldung",
            title: "Melden Sie sich bei DIMLIM an",

            email: "email",
            password: "Passwort",
            tfa: "Zwei-Faktor-Authentifizierung",

            login: "Anmeldung",
            submit: "Einreichen",
            forgotPassword: "Haben Sie Ihr Passwort vergessen?",
            doNotHaveAnAccount: "Sie haben noch kein Konto? & Registrieren",
            tfaHelp: "Gehen Sie zu Ihrer Authentifizierungs-App und geben Sie den 6-stelligen Code ein oder geben Sie einen Ihrer Backup-Codes ein",

            emailRequired: "email ist erforderlich.",
            passwordRequired: "Passwort wird benötigt.",
            emailInvalid: "email ist ungültig.",
            emailOrPasswordIncorrect: "email oder Passwort ist falsch.",
            rateLimitExceeded: "Zu viele Anmeldeversuche, bitte versuchen Sie es später erneut.",
            invalidTfa: "Ungültiger TFA-Code, bitte versuchen Sie es erneut.",

            navbar: {
                login: "Anmeldung",
                register: "Registrieren",
                about: "Über diese Seite",
                support: "Die Unterstützung",
                download: "Download",
            },
        },
        register: {
            pageTitle: "DIMLIM | Registrieren",
            title: "Registrieren Sie sich bei DIMLIM",

            email: "email",
            username: "Nutzername",
            password: "Passwort",
            confirmPassword: "Passwort bestätigen",

            register: "Registrieren",
            alreadyHaveAnAccount: "Sie haben bereits ein Konto? & Anmeldung",

            emailRequired: "email ist erforderlich",
            usernameRequired: "Benutzername wird benötigt",
            passwordRequired: "Passwort wird benötigt",
            confirmPasswordRequired: "Bitte bestätigen Sie Ihr Passwort",

            emailInvalid: "email ist ungültig",
            usernameInvalid: "Benutzernamen dürfen nur Buchstaben, Zahlen und Punkte (.) enthalten.",
            usernameLength: "Der Benutzername muss zwischen 3 und 32 Zeichen lang sein",
            passwordLength: "Das Passwort muss zwischen 8 und 256 Zeichen lang sein",

            usernameInUse: "Benutzername ist bereits in Benutzung",
            emailInUse: "email wird bereits verwendet",
            rateLimitExceeded: "Sie haben bereits vor Kurzem ein Konto registriert, bitte versuchen Sie es später erneut",

            navbar: {
                login: "Anmeldung",
                register: "Registrieren",
                about: "Über diese Seite",
                support: "Die Unterstützung",
                download: "Download",
            },
        },
        verifyEmail: {
            pageTitle: "DIMLIM | email bestätigen",

            expired: "Der Code ist abgelaufen.",
            invalid: "Der eingegebene Code ist ungültig.",
            successNotLoggedIn: "Ihre email wurde bestätigt, Sie können sich jetzt in Ihr Konto einloggen.",
            successLoggedIn: "Deine email wurde verifiziert.",

            login: "Anmeldung",
            goHome: "Gehen Sie zur Hauptseite",

            navbar: {
                login: "Anmeldung",
                register: "Registrieren",
                about: "Über diese Seite",
                support: "Die Unterstützung",
                download: "Download",

                profile: "Profil",
                settings: "Einstellungen",

                logout: "Ausloggen",
            },
        },
    },
    settings: {
        index: {
            pageTitle: "DIMLIM | Einstellungen",
            title: "DIMLIM Einstellungen",

            navbar: {
                profile: "Profil",
                settings: "Einstellungen",

                logout: "Ausloggen",
            },

            tabs: {
                general: "Allgemein",
                security: "Sicherheit",
                privacy: "Privatsphäre",
                account: "Konto",
            },

            general: {
                title: "Allgemeine Informationen",
                username: "Nutzername:",
                bio: "Biografie:",
                email: "Email:",
                preferredLanguage: "Bevorzugte Sprache:",
                contacts: "Kontakte:",
                blockedContacts: "Blockierte Kontakte:",
                creation: "Erstellungsdatum des Kontos:",

                locales: {
                    de: "Deutsch",
                    en: "English",
                    es: "Español",
                    fr: "Français",
                    pr: "Português",
                },

                dialogs: {
                    avatar: {
                        title: "Möchten Sie dieses Bild als Ihren Avatar verwenden?",
                        cancel: "Absagen",
                        yes: "Ja",
                    },
                    email: {
                        title: "Bitte geben Sie Ihre neue email ein",
                        subTitle: "Diese email wird nicht verifiziert und Sie müssen den Prozess der erneuten Verifizierung Ihrer email durchlaufen",

                        newEmail: "Ihre neue email",
                        password: "Ihr aktuelles Passwort",

                        cancel: "Abbrechen",
                        yes: "ja",

                        missing: "Bitte alle Eingaben ausfüllen",
                        invalidEmail: "Die eingegebene email ist ungültig",

                        "email-already-in-use": "Die eingegebene email-Adresse wird bereits verwendet",
                        "user-not-found": "Aight Kumpel, wie zum Teufel machst du das dann, ich werde mich nicht einmal darum kümmern",
                        "rate-limit-exceeded": "Sie haben zu oft versucht, Ihre email-Adresse zu ändern, bitte versuchen Sie es später erneut.",
                    },
                    language: {
                        title: "Bitte wählen Sie eine Sprache aus",
                        subTitle: "Dies wird die Sprache der App festlegen",

                        cancel: "Abbrechen",
                        change: "Sprache ändern",
                    },
                    bio: {
                        title: "Bitte geben Sie Ihre neue Biografie ein",
                        cancel: "Abbrechen",
                        change: "Bio ändern",
                    },
                },
            },
            security: {
                password: "Passwort",
                tfa: "Zwei-Faktor-Authentifizierung",

                tfaActive: "Aktiv",
                tfaNotActive: "Nicht eingerichtet",

                dialogs: {
                    password: {
                        title: "Passwort ändern",
                        old: "Dein altes Passwort",
                        new: "Ihr neues Passwort",
                        tfa: "TFA-Code/Backup-Code",

                        cancel: "Abbrechen",
                        change: "Passwort ändern",

                        unauthorized: "Ungültiges Passwort.",
                        "missing-parameters": "Bitte füllen Sie alle Eingaben aus.",
                        "invalid-parameters": "Ihr neues Passwort sollte mehr als 8 Zeichen und weniger als 256 Zeichen haben.",
                        "invalid-tfa-code": "Ungültiger TFA-Code, bitte versuchen Sie es erneut.",
                        "rate-limit-exceeded": "Sie haben zu oft versucht, Ihr Passwort zu ändern, bitte versuchen Sie es später erneut.",
                    },
                    setupTfa: {
                        title: "Zwei-Faktor-Authentifizierung",
                        subTitle: "TFA fügt eine zusätzliche Sicherheitsebene hinzu, bei der Sie auch ein Gerät benötigen, um sich bei Ihrem Konto anzumelden.",
                        disableLabel: "TFA-Code/Backup-Code",

                        emailVerified: "Sie müssen Ihre email bestätigen, um TFA zu aktivieren",

                        activate: "Aktivieren",
                        deactivate: "Deaktivieren",
                        cancel: "Abbrechen",
                        ok: "OK",

                        "missing-parameters": "Bitte füllen Sie alle Eingaben aus.",
                        "invalid-tfa-code": "Ungültiger TFA-Code, bitte versuchen Sie es erneut.",
                        "rate-limit-exceeded": "Sie haben zu oft versucht, TFA zu deaktivieren, bitte versuchen Sie es später erneut.",
                    },
                    activateTfa: {
                        title: "Zwei-Faktor-Authentifizierung",
                        warning:
                            "STELLEN SIE SICHER, DASS SIE DEN CODE IN IHRER TFA-APP EINGEBEN, SIE WERDEN DIESEN CODE NICHT WIEDER SEHEN, WENN SIE IHN VERLIEREN, VERLIEREN SIE IHR KONTO",
                        done: "Fertig",
                    },
                    backupTfa: {
                        title: "Zwei-Faktor-Authentifizierung",
                        subTitle:
                            "Zur Bestätigung und um Ihre Sicherungscodes zu erhalten, geben Sie bitte einen Code ein, der von Ihrer TFA-App generiert wurde",
                        warning:
                            "Dies sind Ihre Sicherungscodes. Wenn Sie Ihr Gerät verlieren, können Sie diese Codes verwenden, um Ihr Konto wiederherzustellen. Sie werden sie nicht wieder sehen, also bewahren Sie sie an einem sicheren Ort auf.",

                        done: "Fertig",
                        submit: "Absenden",

                        "missing-parameters": "Bitte füllen Sie alle Eingaben aus.",
                        "invalid-tfa-code": "Ungültiger TFA-Code, bitte versuchen Sie es erneut.",
                        "rate-limit-exceeded": "Sie haben zu oft versucht, TFA zu deaktivieren, bitte versuchen Sie es später erneut.",
                    },
                },
            },
            account: {
                emailStatus: "Email-Status",
                emailVerified: "Email bestätigt",
                emailNotVerified: "Email nicht bestätigt",

                logout: "Abmelden",
                logoutDesc: "Ihre Nachrichten werden gelöscht",

                deleteAccount: "Konto löschen",
                deleteAccount: "Lösche alles auf deinem Konto",

                dialogs: {
                    verifyEmail: {
                        title: "Bestätigen Sie Ihre email",
                        subTitle: "Bestätigen Sie Ihre email-Adresse, um TFA zu aktivieren, und erhalten Sie Sicherheitsupdates direkt in Ihre email.",

                        verify: "Verifizieren",
                        cancel: "Abbrechen",
                    },
                    verificationEmailSent: {
                        title: "Bestätige deine email",
                        subTitle: "Wir haben eine email an & mit einem Code gesendet, der in 5 Stunden abläuft.",
                        ok: "OK",
                    },
                    logout: {
                        title: "Abmelden",
                        warning: "Alle Ihre Nachrichten werden aus Sicherheitsgründen gelöscht.",
                        cancel: "Abbrechen",
                    },
                    deleteAccount: {
                        title: "Konto löschen",
                        warning: "Danach können Sie Ihr Konto nicht wiederherstellen, seien Sie vorsichtig.",

                        password: "Passwort",
                        tfaCode: "TFA-Code/Backup-Code",

                        cancel: "Abbrechen",

                        "missing-parameters": "Bitte füllen Sie alle Eingaben aus.",
                        "rate-limit-exceeded": "Sie haben zu oft versucht, Ihr Konto zu löschen, bitte versuchen Sie es später erneut.",
                        "invalid-tfa-code": "Ungültiger TFA-Code",
                        unauthorized: "Ungültiges Passwort",
                    },
                },
            },
        },
    },
};

module.exports = de;
