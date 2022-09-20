(() => {
var exports = {};
exports.id = 374;
exports.ids = [374];
exports.modules = {

/***/ 4387:
/***/ ((module) => {

// Exports
module.exports = {
	"page": "register_page__HFweu",
	"navbar": "register_navbar__SCq2m",
	"register-form": "register_register-form__xNnYu",
	"already-a-user": "register_already-a-user__wCTG_",
	"error-label": "register_error-label__FVroX"
};


/***/ }),

/***/ 6456:
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
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(358);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _components_navbar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6565);
/* harmony import */ var _styles_accounts_register_module_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(4387);
/* harmony import */ var _styles_accounts_register_module_scss__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_styles_accounts_register_module_scss__WEBPACK_IMPORTED_MODULE_8__);









const getServerSideProps = async (context)=>{
    if (context.req.isAuthenticated()) return {
        redirect: {
            destination: "/home",
            permanent: false
        }
    };
    try {
        let languageResponse = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "post",
            url: `${process.env.HOST}/api/content/language/`,
            data: {
                lang: context.req.headers["accept-language"].split(",")[0],
                category: "accounts",
                page: "register"
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
                langCode: context.req.headers["accept-language"].split(",")[0],
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
const Register = (props)=>{
    const [buttonLoading, setButtonLoading] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [emailError, setEmailError] = react__WEBPACK_IMPORTED_MODULE_1__.useState(null);
    const [usernameError, setUsernameError] = react__WEBPACK_IMPORTED_MODULE_1__.useState(null);
    const [passwordError, setPasswordError] = react__WEBPACK_IMPORTED_MODULE_1__.useState(null);
    const handleRegister = (e)=>{
        e.preventDefault();
        setButtonLoading(true);
        setEmailError(null);
        setUsernameError(null);
        setPasswordError(null);
        let email = document.querySelector("#email").value;
        let username = document.querySelector("#username").value;
        let password = document.querySelector("#password").value;
        let confirmPassword = document.querySelector("#confirm-password").value;
        // Check if inputs are filled in
        if (!email) {
            setEmailError(props.lang.emailRequired);
            return setButtonLoading(false);
        }
        if (!username) {
            setUsernameError(props.lang.emailRequired);
            return setButtonLoading(false);
        }
        if (!password) {
            setPasswordError(props.lang.passwordRequired);
            return setButtonLoading(false);
        }
        if (!confirmPassword) {
            setPasswordError(props.lang.confirmPasswordRequired);
            return setButtonLoading(false);
        }
        // Validate each input
        if (!validator__WEBPACK_IMPORTED_MODULE_3___default().isEmail(email)) {
            setEmailError(props.lang.emailInvalid);
            return setButtonLoading(false);
        }
        if (!validator__WEBPACK_IMPORTED_MODULE_3___default().isAlphanumeric(username, "en-US", {
            ignore: "."
        })) {
            setUsernameError(props.lang.usernameInvalid);
            return setButtonLoading(false);
        }
        if (username.length < 3 || username.length > 32) {
            setUsernameError(props.lang.usernameLength);
            return setButtonLoading(false);
        }
        if (password.length < 3 || password.length > 64) {
            setPasswordError(props.lang.passwordLength);
            return setButtonLoading(false);
        }
        (async ()=>{
            try {
                let testResults = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
                    method: "POST",
                    url: `${props.host}/api/accounts/check-use`,
                    data: {
                        email: email,
                        username: username
                    }
                });
                if (testResults.data.message == "all-good") {
                    let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
                        method: "POST",
                        url: `${props.host}/api/accounts/register`,
                        data: {
                            email: email,
                            username: username,
                            password: password,
                            lang: props.langCode
                        }
                    });
                    switch(response.data.message){
                        case "success":
                            window.location.href = "/home";
                            break;
                        case "try-again":
                            let newResponse = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
                                method: "POST",
                                url: `${props.host}/api/accounts/register`,
                                data: {
                                    email: email,
                                    username: username,
                                    password: password,
                                    lang: props.langCode
                                }
                            });
                            if (newResponse.data.message == "success") return window.location.href = "/home";
                            break;
                        case "rate-limit-exceeded":
                            document.querySelector("#password").value = "";
                            setButtonLoading(false);
                            setEmailError(props.lang.rateLimitExceeded);
                            break;
                        default:
                            window.location.href = `/error?code=${response.data.status}&message=${response.data.message}`;
                            break;
                    }
                } else {
                    if (testResults.data.message == "email-already-in-use") {
                        document.querySelector("#email").value = "";
                        setButtonLoading(false);
                        return setEmailError(props.lang.emailInUse);
                    }
                    if (testResults.data.message == "username-already-in-use") {
                        document.querySelector("#username").value = "";
                        setButtonLoading(false);
                        return setUsernameError(props.lang.usernameInUse);
                    }
                    return window.location.href = `/error?code=${testResults.data.status}&message=${testResults.data.message}`;
                }
            } catch (err) {
                return window.location.href = `/error?code=${err.response.status}`;
            }
        })();
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: (_styles_accounts_register_module_scss__WEBPACK_IMPORTED_MODULE_8___default().page),
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_navbar__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z, {
                    lang: props.lang.navbar,
                    user: null
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_head__WEBPACK_IMPORTED_MODULE_6___default()), {
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("title", {
                        children: props.lang.pageTitle
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_5__.Container, {
                    className: (_styles_accounts_register_module_scss__WEBPACK_IMPORTED_MODULE_8___default()["register-form"]),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                            children: props.lang.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                            htmlFor: "email",
                            children: props.lang.email
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            type: "text",
                            name: "email",
                            id: "email",
                            placeholder: "john@example.com"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_accounts_register_module_scss__WEBPACK_IMPORTED_MODULE_8___default()["error-label"]),
                            children: emailError
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                            htmlFor: "username",
                            children: props.lang.username
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            type: "text",
                            name: "username",
                            id: "username",
                            placeholder: "john"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_accounts_register_module_scss__WEBPACK_IMPORTED_MODULE_8___default()["error-label"]),
                            children: usernameError
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                            htmlFor: "password",
                            children: props.lang.password
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            type: "password",
                            name: "password",
                            id: "password",
                            placeholder: "••••••••"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_accounts_register_module_scss__WEBPACK_IMPORTED_MODULE_8___default()["error-label"]),
                            children: passwordError
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                            htmlFor: "confirm-password",
                            children: props.lang.confirmPassword
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            type: "password",
                            name: "confirm-password",
                            id: "confirm-password",
                            placeholder: "••••••••"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__.Row, {
                            xs: "1",
                            sm: "1",
                            md: "2",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__.Col, {
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_5__.Button, {
                                        onClick: handleRegister,
                                        disabled: buttonLoading,
                                        type: "submit",
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                hidden: buttonLoading,
                                                children: props.lang.register
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__.Spinner, {
                                                size: "sm",
                                                hidden: !buttonLoading,
                                                animation: "border"
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__.Col, {
                                    className: `${(_styles_accounts_register_module_scss__WEBPACK_IMPORTED_MODULE_8___default()["already-a-user"])} align-middle`,
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                        children: [
                                            props.lang.alreadyHaveAnAccount.split("&")[0],
                                            " ",
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.Link, {
                                                href: "/login",
                                                children: props.lang.alreadyHaveAnAccount.split("&")[1]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Register);


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
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [565], () => (__webpack_exec__(6456)));
module.exports = __webpack_exports__;

})();