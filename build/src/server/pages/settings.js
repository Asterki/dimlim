(() => {
var exports = {};
exports.id = 662;
exports.ids = [662];
exports.modules = {

/***/ 397:
/***/ ((module) => {

// Exports
module.exports = {
	"page": "settings_page__xOhMx",
	"categories": "settings_categories__29ohg",
	"tab": "settings_tab___9yfK",
	"avatar": "settings_avatar__jz42w",
	"add-picture": "settings_add-picture__uAfj5",
	"actions": "settings_actions__KK4_s",
	"action": "settings_action__0DmjD",
	"action-title": "settings_action-title__3w0rv",
	"action-icon": "settings_action-icon__cccW1",
	"dialog-container": "settings_dialog-container__Ot_x1",
	"dialog": "settings_dialog__FX6JC",
	"dialog-label": "settings_dialog-label__25_bf",
	"error": "settings_error__Hye75"
};


/***/ }),

/***/ 8044:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getServerSideProps": () => (/* binding */ getServerSideProps)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2167);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var validator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1564);
/* harmony import */ var validator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(validator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_navbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6565);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(358);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _mui_lab__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6072);
/* harmony import */ var _mui_lab__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_mui_lab__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7915);
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(397);
/* harmony import */ var _styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10__);
/* eslint-disable @next/next/no-img-element */ 










const getServerSideProps = async (context)=>{
    if (!context.req.isAuthenticated()) return {
        redirect: {
            destination: "/login",
            permanent: false
        }
    };
    try {
        let languageResponse = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "post",
            url: `${process.env.HOST}/api/content/language/`,
            data: {
                lang: context.req.user.preferredLanguage == "" ? context.req.headers["accept-language"].split(",")[0] : context.req.user.preferredLanguage,
                category: "settings",
                page: "index"
            }
        });
        if (languageResponse.data.status !== 200) {
            return {
                redirect: {
                    destination: `/error?code=${languageResponse.data.status}`,
                    permanent: false
                }
            };
        }
        return {
            props: {
                lang: languageResponse.data.content,
                user: context.req.user,
                host: process.env.HOST
            }
        };
    } catch (err) {
        return {
            redirect: {
                destination: `/error?code=${err.response.status}`,
                permanent: false
            }
        };
    }
};
const Settings = (props)=>{
    const [activeTab, setActiveTab] = react__WEBPACK_IMPORTED_MODULE_1__.useState("1");
    // Profile picture
    const [avatarDialogOpen, setAvatarDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [avatarPreviewFile, setAvatarPreviewFile] = react__WEBPACK_IMPORTED_MODULE_1__.useState("");
    // Email
    const [emailDialogOpen, setEmailDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [emailDialogEmailError, setEmailDialogEmailError] = react__WEBPACK_IMPORTED_MODULE_1__.useState("");
    // Language
    const [languageDialogOpen, setLanguageDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [selectedLanguage, setSelectedLanguage] = react__WEBPACK_IMPORTED_MODULE_1__.useState(props.user.preferredLanguage);
    // Bio
    const [bioDialogOpen, setBioDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    // Password
    const [passwordDialogOpen, setPasswordDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [passwordDialogEmailError, setPasswordDialogEmailError] = react__WEBPACK_IMPORTED_MODULE_1__.useState("");
    // TFA
    const [setupTfaDialogOpen, setSetupTfaDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [activateTfaDialogOpen, setActivateTfaDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [tfaConfirmDialogOpen, setTfaConfirmDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [tfaBackupDialogOpen, setTfaBackupDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [tfaImage, setTfaImage] = react__WEBPACK_IMPORTED_MODULE_1__.useState("");
    const [tfaSecret, setTfaSecret] = react__WEBPACK_IMPORTED_MODULE_1__.useState("");
    const [tfaBackupCodes, setTfaBackupCodes] = react__WEBPACK_IMPORTED_MODULE_1__.useState([]);
    const [tfaDialogEmailError, setTfaDialogEmailError] = react__WEBPACK_IMPORTED_MODULE_1__.useState("");
    const [tfaBackupDialogEmailError, setTfaBackupDialogEmailError] = react__WEBPACK_IMPORTED_MODULE_1__.useState("");
    // Email
    const [verifyEmailDialogOpen, setVerifyEmailDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [verificationEmailSentDialogOpen, setVerificationEmailSentDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    // Logout
    const [logoutDialogOpen, setLogoutDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    // Delete account
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [deleteAccountError, setDeleteAccountError] = react__WEBPACK_IMPORTED_MODULE_1__.useState("");
    const changeEmail = async (event)=>{
        let password = document.querySelector("#dialog-password").value;
        let email = document.querySelector("#dialog-email").value;
        if (!email || !password) return setEmailDialogEmailError(props.lang.general.dialogs.email.missing);
        if (!validator__WEBPACK_IMPORTED_MODULE_3___default().isEmail(email)) return setEmailDialogEmailError(props.lang.general.dialogs.email.invalidEmail);
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "POST",
            url: `${props.host}/api/users/change-email`,
            data: {
                password: password,
                newEmail: email
            }
        });
        if (response.data.code == 500) return window.location.href = `/error?id=${response.data.id}`;
        if (response.data.message == "success") {
            return window.location.reload();
        } else setEmailDialogEmailError(props.lang.general.dialogs.email[response.data.message]);
    };
    const changeLanguage = async (event)=>{
        await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "POST",
            url: `${props.host}/api/users/set-language`,
            data: {
                newLanguage: selectedLanguage
            }
        });
        setLanguageDialogOpen(false);
        return window.location.reload();
    };
    const changeBio = async (event)=>{
        await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "POST",
            url: `${props.host}/api/users/set-bio`,
            data: {
                newBio: document.querySelector("#dialog-bio-input").value
            }
        });
        setBioDialogOpen(false);
        return window.location.reload();
    };
    const changePassword = async (event)=>{
        let oldPass = document.querySelector("#password-old-input").value;
        let newPass = document.querySelector("#password-new-input").value;
        let tfaCode = "";
        if (!oldPass || !newPass) return setPasswordDialogEmailError(props.lang.security.dialogs.password["missing-parameters"]);
        if (newPass.length < 8 || newPass.length > 256) return setPasswordDialogEmailError(props.lang.security.dialogs.password["invalid-parameters"]);
        if (props.user.tfa.secret !== "") {
            tfaCode = document.querySelector("#password-tfa-input").value;
            if (!tfaCode) return setPasswordDialogEmailError(props.lang.security.dialogs.password["missing-parameters"]);
        }
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "POST",
            url: `${props.host}/api/users/change-password`,
            data: {
                oldPassword: oldPass,
                newPassword: newPass,
                tfaCode: tfaCode
            }
        });
        if (response.data.code == 500) return window.location.href = `/error?id=${response.data.id}`;
        if (response.data.message == "success") {
            setPasswordDialogOpen(false);
            return window.location.reload();
        } else setPasswordDialogEmailError(props.lang.security.password[response.data.message]);
    };
    const activateTFA = async (event)=>{
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "post",
            url: `${props.host}/api/accounts/activate-tfa/`
        });
        setTfaImage(response.data.image);
        setTfaSecret(response.data.code);
        setTfaConfirmDialogOpen(false);
        setActivateTfaDialogOpen(true);
    };
    const deactivateTFA = async (event)=>{
        let tfaCode = document.querySelector("#tfa-deactivate-code").value;
        if (!tfaCode) return setTfaDialogEmailError(props.lang.security.dialogs.setupTfa["missing-parameters"]);
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "POST",
            url: `${props.host}/api/accounts/deactivate-tfa`,
            data: {
                tfaCode: tfaCode
            }
        });
        if (response.data.code == 500) return window.location.href = `/error?id=${response.data.id}`;
        if (response.data.message == "success") {
            setSetupTfaDialogOpen(false);
            return window.location.reload();
        } else setTfaDialogEmailError(props.lang.security.dialogs.setupTfa[response.data.message]);
    };
    const getTFABackupCodes = async (event)=>{
        let tfaCode = document.querySelector("#dialog-backup-tfa-code-input").value;
        if (!tfaCode) return setTfaBackupDialogEmailError(props.lang.security.dialogs.backupTfa["missing-parameters"]);
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "post",
            url: `${props.host}/api/accounts/verify-tfa/`,
            data: {
                code: tfaCode
            }
        });
        if (response.data.code == 500) return window.location.href = `/error?id=${response.data.id}`;
        if (response.data.message == "success") {
            setTfaConfirmDialogOpen(false);
            setTfaBackupDialogOpen(true);
            setTfaBackupCodes(response.data.codes);
            setPasswordDialogEmailError("");
        } else setPasswordDialogEmailError(props.lang.security.password[response.data.message]);
    };
    const sendVerificationEmail = async (event)=>{
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "POST",
            url: `${props.host}/api/accounts/send-verification-email`,
            data: {
                lang: props.user.preferredLanguage
            }
        });
        if (response.data.code == 500) return window.location.href = `/error?id=${response.data.id}`;
        setVerifyEmailDialogOpen(false);
        setVerificationEmailSentDialogOpen(true);
    };
    const deleteAccount = async (event)=>{
        let password = document.querySelector("#delete-account-password-input").value;
        let tfaCode = "";
        if (props.user.tfa.secret !== "") {
            tfaCode = document.querySelector("#delete-account-tfa-input").value;
            if (!tfaCode) return setDeleteAccountError(props.lang.account.dialogs.deleteAccount["missing-parameters"]);
        }
        if (!password) return setDeleteAccountError(props.lang.account.dialogs.deleteAccount["missing-parameters"]);
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "POST",
            url: `${props.host}/api/accounts/delete-account`,
            data: {
                tfaCode: tfaCode,
                password: password
            }
        });
        console.log(response);
        if (response.data.code == 500) return window.location.href = `/error?id=${response.data.id}`;
        if (response.data.message == "success") {
            return window.location.reload();
        } else setDeleteAccountError(props.lang.account.dialogs.deleteAccount[response.data.message]);
    };
    const codeList = tfaBackupCodes.map((code)=>{
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.ListItem, {
            children: code
        }, code);
    });
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().page),
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_navbar__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, {
                lang: props.lang.navbar,
                user: props.user
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_head__WEBPACK_IMPORTED_MODULE_4___default()), {
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("title", {
                    children: props.lang.pageTitle
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: avatarDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.general.dialogs.avatar.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                            width: "200",
                            src: avatarPreviewFile,
                            alt: "Avatar"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        setAvatarDialogOpen(false);
                                        setAvatarPreviewFile("");
                                    },
                                    children: props.lang.general.dialogs.avatar.cancel
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        setAvatarDialogOpen(false);
                                        setAvatarPreviewFile("");
                                        document.querySelector("#avatar-form").submit();
                                    },
                                    children: props.lang.general.dialogs.avatar.yes
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: emailDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.general.dialogs.email.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            children: props.lang.general.dialogs.email.subTitle
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                children: props.lang.general.dialogs.email.newEmail
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "dialog-email",
                            type: "text",
                            placeholder: "john@example.com"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                children: props.lang.general.dialogs.email.password
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "dialog-password",
                            type: "password",
                            placeholder: "••••••••"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().error),
                            children: emailDialogEmailError
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        setEmailDialogOpen(false);
                                        setEmailDialogEmailError("");
                                    },
                                    children: props.lang.general.dialogs.email.cancel
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: changeEmail,
                                    children: props.lang.general.dialogs.email.yes
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: languageDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.general.dialogs.language.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            children: props.lang.general.dialogs.language.subTitle
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogContent, {
                            dividers: true,
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.RadioGroup, {
                                name: "language",
                                onChange: (event)=>{
                                    setSelectedLanguage(event.target.value);
                                    switch(event.target.value){
                                        case "English":
                                            setSelectedLanguage("en");
                                            break;
                                        case "Espa\xf1ol":
                                            setSelectedLanguage("es");
                                            break;
                                        case "Fran\xe7ais":
                                            setSelectedLanguage("fr");
                                            break;
                                        case "Portugu\xeas":
                                            setSelectedLanguage("pr");
                                            break;
                                        case "Deutsch":
                                            setSelectedLanguage("de");
                                            break;
                                    }
                                },
                                value: props.lang.general.locales[selectedLanguage],
                                children: [
                                    "English",
                                    "Espa\xf1ol",
                                    "Fran\xe7ais",
                                    "Portugu\xeas",
                                    "Deutsch"
                                ].map((option)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.FormControlLabel, {
                                        value: option,
                                        control: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Radio, {}),
                                        label: option
                                    }, option))
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        setSelectedLanguage(props.user.preferredLanguage);
                                        setLanguageDialogOpen(false);
                                    },
                                    children: props.lang.general.dialogs.language.cancel
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: changeLanguage,
                                    children: props.lang.general.dialogs.language.change
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: bioDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.general.dialogs.bio.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "dialog-bio-input",
                            type: "text",
                            defaultValue: props.user.bio
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        document.querySelector("#dialog-bio-input").value = "";
                                        setBioDialogOpen(false);
                                    },
                                    children: props.lang.general.dialogs.bio.cancel
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: changeBio,
                                    children: props.lang.general.dialogs.bio.change
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: passwordDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.security.dialogs.password.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                children: props.lang.security.dialogs.password.old
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "password-old-input",
                            type: "password",
                            placeholder: "••••••••"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                children: props.lang.security.dialogs.password.new
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "password-new-input",
                            type: "password",
                            placeholder: "••••••••"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        props.user.tfa.secret !== "" && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                        children: props.lang.security.dialogs.password.tfa
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                    id: "password-tfa-input",
                                    type: "password",
                                    placeholder: "••••••"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {})
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().error),
                            children: passwordDialogEmailError
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        setPasswordDialogOpen(false);
                                        setPasswordDialogEmailError("");
                                    },
                                    children: props.lang.security.dialogs.password.cancel
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: changePassword,
                                    children: props.lang.security.dialogs.password.change
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: setupTfaDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.security.dialogs.setupTfa.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                            children: props.lang.security.dialogs.setupTfa.subTitle
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        props.user.email.verified == false && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    children: props.lang.security.dialogs.setupTfa.emailVerified
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                        onClick: (event)=>{
                                            setSetupTfaDialogOpen(false);
                                        },
                                        children: props.lang.security.dialogs.setupTfa.ok
                                    })
                                })
                            ]
                        }),
                        props.user.tfa.secret == "" && props.user.email.verified == true && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        setSetupTfaDialogOpen(false);
                                    },
                                    children: props.lang.security.dialogs.setupTfa.cancel
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: activateTFA,
                                    children: props.lang.security.dialogs.setupTfa.activate
                                })
                            ]
                        }),
                        props.user.tfa.secret !== "" && props.user.email.verified == true && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                        children: props.lang.security.dialogs.setupTfa.deactivateLabel
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                    id: "tfa-deactivate-code",
                                    type: "password",
                                    placeholder: "••••••"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().error),
                                    children: tfaDialogEmailError
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                            onClick: (event)=>{
                                                setSetupTfaDialogOpen(false);
                                                setTfaDialogEmailError("");
                                            },
                                            children: props.lang.security.dialogs.setupTfa.cancel
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                            onClick: deactivateTFA,
                                            children: props.lang.security.dialogs.setupTfa.deactivate
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: activateTfaDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.security.dialogs.activateTfa.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                            src: tfaImage,
                            alt: "tfa image"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            children: tfaSecret
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().error),
                            children: props.lang.security.dialogs.activateTfa.warning
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                onClick: (event)=>{
                                    setActivateTfaDialogOpen(false);
                                    setTfaConfirmDialogOpen(true);
                                },
                                children: props.lang.security.dialogs.activateTfa.done
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: tfaConfirmDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.security.dialogs.backupTfa.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                            children: props.lang.security.dialogs.backupTfa.subTitle
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "dialog-backup-tfa-code-input",
                            type: "password",
                            placeholder: "••••••••"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().error),
                            children: tfaBackupDialogEmailError
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                onClick: getTFABackupCodes,
                                children: props.lang.security.dialogs.backupTfa.submit
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: tfaBackupDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.security.dialogs.backupTfa.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                            children: props.lang.security.dialogs.backupTfa.warning
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.List, {
                            children: codeList
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                onClick: (event)=>{
                                    setTfaBackupDialogOpen(false);
                                    return window.location.reload();
                                },
                                children: props.lang.security.dialogs.backupTfa.done
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: verifyEmailDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.account.dialogs.verifyEmail.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            children: props.lang.account.dialogs.verifyEmail.subTitle
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        setVerifyEmailDialogOpen(false);
                                    },
                                    children: props.lang.account.dialogs.verifyEmail.cancel
                                }),
                                props.user.email.verified == false && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: sendVerificationEmail,
                                    children: props.lang.account.dialogs.verifyEmail.verify
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: verificationEmailSentDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.account.dialogs.verificationEmailSent.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            children: props.lang.account.dialogs.verificationEmailSent.subTitle.split("&")[0] + props.user.email.value + props.lang.account.dialogs.verificationEmailSent.subTitle.split("&")[1]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                onClick: (event)=>{
                                    setVerificationEmailSentDialogOpen(false);
                                },
                                children: props.lang.account.dialogs.verificationEmailSent.ok
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: logoutDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.account.dialogs.logout.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            children: props.lang.account.dialogs.logout.warning
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        setLogoutDialogOpen(false);
                                    },
                                    children: props.lang.account.dialogs.logout.cancel
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        setLogoutDialogOpen(false);
                                        window.location.href = "/api/accounts/logout";
                                    },
                                    children: props.lang.account.dialogs.logout.title
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Dialog, {
                open: deleteAccountDialogOpen,
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogTitle, {
                            children: props.lang.account.dialogs.deleteAccount.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            children: props.lang.account.dialogs.deleteAccount.warning
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                children: props.lang.account.dialogs.deleteAccount.password
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "delete-account-password-input",
                            type: "password",
                            placeholder: "••••••••"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        props.user.tfa.secret !== "" && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                        children: props.lang.account.dialogs.deleteAccount.tfaCode
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                    id: "delete-account-tfa-input",
                                    type: "password",
                                    placeholder: "••••••"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {})
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().error),
                            children: deleteAccountError
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.DialogActions, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: (event)=>{
                                        setDeleteAccountDialogOpen(false);
                                    },
                                    children: props.lang.account.dialogs.logout.cancel
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Button, {
                                    onClick: deleteAccount,
                                    children: props.lang.account.dialogs.deleteAccount.title
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().categories),
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Box, {
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_lab__WEBPACK_IMPORTED_MODULE_8__.TabContext, {
                        value: activeTab,
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Box, {
                                sx: {
                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                                    borderColor: "divider",
                                    padding: 0,
                                    margin: 0
                                },
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_lab__WEBPACK_IMPORTED_MODULE_8__.TabList, {
                                    scrollButtons: true,
                                    allowScrollButtonsMobile: true,
                                    variant: "fullWidth",
                                    onChange: (event, tab)=>{
                                        setActiveTab(tab);
                                    },
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Tab, {
                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().tab),
                                            label: props.lang.tabs.general,
                                            value: "1"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Tab, {
                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().tab),
                                            label: props.lang.tabs.security,
                                            value: "2"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Tab, {
                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().tab),
                                            label: props.lang.tabs.account,
                                            value: "3"
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_lab__WEBPACK_IMPORTED_MODULE_8__.TabPanel, {
                                value: "1",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                        children: props.lang.general.title
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Badge, {
                                        className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().avatar),
                                        overlap: "circular",
                                        anchorOrigin: {
                                            vertical: "bottom",
                                            horizontal: "right"
                                        },
                                        badgeContent: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.AddAPhoto, {
                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["add-picture"]),
                                            onClick: (e)=>{
                                                document.querySelector("#avatar-input").click();
                                            }
                                        }),
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Avatar, {
                                            src: props.user.avatar == "" ? "" : `/avatars/${props.user.avatar}`,
                                            sx: {
                                                width: 200,
                                                height: 200,
                                                textAlign: "center"
                                            }
                                        })
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                        fluid: true,
                                        className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().actions),
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                                fluid: true,
                                                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().action),
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                        className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-title"]),
                                                        children: props.lang.general.username
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                                                    children: props.user.username
                                                                })
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-icon"])
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                                fluid: true,
                                                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().action),
                                                onClick: (e)=>{
                                                    setBioDialogOpen(true);
                                                },
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                        className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-title"]),
                                                        children: props.lang.general.bio
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h6", {
                                                                    children: props.user.bio == "" ? "None" : props.user.bio
                                                                })
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-icon"]),
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.Create, {})
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                                fluid: true,
                                                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().action),
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                        className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-title"]),
                                                        children: props.lang.general.email
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                                                    children: props.user.email.value
                                                                })
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-icon"]),
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.Create, {
                                                                    onClick: (e)=>{
                                                                        setEmailDialogOpen(true);
                                                                    }
                                                                })
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                                fluid: true,
                                                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().action),
                                                onClick: (e)=>{
                                                    setLanguageDialogOpen(true);
                                                },
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                        className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-title"]),
                                                        children: props.lang.general.preferredLanguage
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                                                    children: props.lang.general.locales[props.user.preferredLanguage]
                                                                })
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                                className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-icon"]),
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.Create, {})
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                        children: props.lang.general.contacts
                                    }),
                                    " ",
                                    props.user.contacts.length,
                                    " ",
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                        children: props.lang.general.blockedContacts
                                    }),
                                    " ",
                                    props.user.blockedContacts.length,
                                    " ",
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                        children: props.lang.general.creation
                                    }),
                                    " ",
                                    new Date(props.user.created).toString(),
                                    " ",
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {})
                                ]
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_lab__WEBPACK_IMPORTED_MODULE_8__.TabPanel, {
                                value: "2",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                    fluid: true,
                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().actions),
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                            fluid: true,
                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().action),
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-title"]),
                                                    children: props.lang.security.password
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                                                children: "••••••••"
                                                            })
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-icon"]),
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.Create, {
                                                                onClick: (e)=>{
                                                                    setPasswordDialogOpen(true);
                                                                }
                                                            })
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                            fluid: true,
                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().action),
                                            onClick: (e)=>{
                                                setSetupTfaDialogOpen(true);
                                            },
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-title"]),
                                                    children: props.lang.security.tfa
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                                                children: props.user.tfa.secret == "" ? props.lang.security.tfaNotActive : props.lang.security.tfaActive
                                                            })
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-icon"]),
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.SecurityUpdateGood, {})
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_lab__WEBPACK_IMPORTED_MODULE_8__.TabPanel, {
                                value: "3",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                    fluid: true,
                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().actions),
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                            fluid: true,
                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().action),
                                            onClick: (e)=>{
                                                setVerifyEmailDialogOpen(true);
                                            },
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-title"]),
                                                    children: props.lang.account.emailStatus
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h6", {
                                                                children: props.user.email.verified == true ? props.lang.account.emailVerified : props.lang.account.emailNotVerified
                                                            })
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-icon"]),
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.Email, {})
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                            fluid: true,
                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().action),
                                            onClick: (e)=>{
                                                setLogoutDialogOpen(true);
                                            },
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-title"]),
                                                    children: props.lang.account.logout
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h6", {
                                                                children: props.lang.account.logoutDesc
                                                            })
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-icon"]),
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.Logout, {})
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                            fluid: true,
                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default().action),
                                            onClick: (e)=>{
                                                setDeleteAccountDialogOpen(true);
                                            },
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                    className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-title"]),
                                                    children: props.lang.account.deleteAccount
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h6", {
                                                                children: props.lang.account.deleteAccountDesc
                                                            })
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                                            className: (_styles_settings_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["action-icon"]),
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.DeleteForever, {})
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            })
                        ]
                    })
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("form", {
                hidden: true,
                id: "avatar-form",
                action: "/api/upload/avatar",
                encType: "multipart/form-data",
                method: "POST",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                    onChange: (event)=>{
                        let file = document.querySelector("#avatar-input").files[0];
                        let reader = new FileReader();
                        reader.onloadend = ()=>{
                            setAvatarPreviewFile(reader.result);
                        };
                        if (file) {
                            setAvatarDialogOpen(true);
                            reader.readAsDataURL(file);
                        } else {
                            setAvatarDialogOpen(false);
                            setAvatarPreviewFile("");
                        }
                    },
                    id: "avatar-input",
                    accept: ".jpg, .png, .jpeg",
                    name: "avatar",
                    type: "file"
                })
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Settings);


/***/ }),

/***/ 7915:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/icons-material");

/***/ }),

/***/ 6072:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/lab");

/***/ }),

/***/ 5692:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/material");

/***/ }),

/***/ 2167:
/***/ ((module) => {

"use strict";
module.exports = require("axios");

/***/ }),

/***/ 968:
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ 6689:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ 358:
/***/ ((module) => {

"use strict";
module.exports = require("react-bootstrap");

/***/ }),

/***/ 997:
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 1564:
/***/ ((module) => {

"use strict";
module.exports = require("validator");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [565], () => (__webpack_exec__(8044)));
module.exports = __webpack_exports__;

})();