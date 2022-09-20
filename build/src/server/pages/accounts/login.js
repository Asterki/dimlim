(() => {
var exports = {};
exports.id = 500;
exports.ids = [500];
exports.modules = {

/***/ 6391:
/***/ ((module) => {

// Exports
module.exports = {
	"page": "login_page__GFe0Z",
	"login-form": "login_login-form__kyG3o",
	"tfa-form": "login_tfa-form__KmDlR",
	"reset-password": "login_reset-password___9qu6",
	"error-label": "login_error-label__vdMLt"
};


/***/ }),

/***/ 8346:
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
/* harmony import */ var _styles_accounts_login_module_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6391);
/* harmony import */ var _styles_accounts_login_module_scss__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_styles_accounts_login_module_scss__WEBPACK_IMPORTED_MODULE_8__);









const getServerSideProps = async (context)=>{
    // If the user is already logged in, it will redirect to the main page instead
    if (context.req.isAuthenticated()) return {
        redirect: {
            destination: "/home",
            permanent: false
        }
    };
    try {
        // Get the language pack
        let languageResponse = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "post",
            url: `${process.env.HOST}/api/content/language/`,
            data: {
                lang: context.req.headers["accept-language"].split(",")[0],
                category: "accounts",
                page: "login"
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
const Login = (props)=>{
    // Error states
    const [buttonLoading, setButtonLoading] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    const [emailError, setEmailError] = react__WEBPACK_IMPORTED_MODULE_1__.useState(null);
    const [passwordError, setPasswordError] = react__WEBPACK_IMPORTED_MODULE_1__.useState(null);
    const [tfaError, setTfaError] = react__WEBPACK_IMPORTED_MODULE_1__.useState(null);
    // Page that is showing
    const [pageShowing, setPageShowing] = react__WEBPACK_IMPORTED_MODULE_1__.useState("login-form");
    // When login button clicked
    const handleLogin = async (e)=>{
        // Reset errors, and set the button to load
        e.preventDefault();
        setButtonLoading(true);
        setEmailError(null);
        setPasswordError(null);
        // Check for validity of inputs
        let email = document.querySelector("#email").value;
        let password = document.querySelector("#password").value;
        let tfa = document.querySelector("#tfa").value;
        if (!email) {
            setEmailError(props.lang.emailRequired);
            return setButtonLoading(false);
        }
        if (!password) {
            setPasswordError(props.lang.passwordRequired);
            return setButtonLoading(false);
        }
        if (!validator__WEBPACK_IMPORTED_MODULE_3___default().isEmail(email)) {
            setEmailError(props.lang.emailInvalid);
            return setButtonLoading(false);
        }
        (async ()=>{
            try {
                // Send the request to the login api
                let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
                    method: "POST",
                    url: `${props.host}/api/accounts/login`,
                    data: {
                        password: password,
                        email: email,
                        tfaCode: tfa
                    }
                });
                // If the login was successful, redirect to the main window
                if (response.data.message == "success") return window.location.href = "/home";
                // If the response was a "requires-tfa" show the tfa page
                if (response.data.message == "requires-tfa") {
                    setButtonLoading(false);
                    return setPageShowing("tfa-form");
                }
                // If not, reset inputs and show error
                if (response.data.message == "invalid-credentials") {
                    document.querySelector("#password").value = "";
                    setButtonLoading(false);
                    return setEmailError(props.lang.emailOrPasswordIncorrect);
                }
                // If the tfa code is invalid
                if (response.data.message == "invalid-tfa-code") {
                    document.querySelector("#tfa").value = "";
                    setButtonLoading(false);
                    return setTfaError(props.lang.invalidTfa);
                }
                // If the user exceeded the login rate
                if (response.data.message == "rate-limit-exceeded") {
                    document.querySelector("#password").value = "";
                    setButtonLoading(false);
                    return setEmailError(props.lang.rateLimitExceeded);
                }
                return window.location.href = `/error?code=${response.data.status}&message=${response.data.message}`;
            } catch (err) {
                return window.location.href = `/error?code=${err.response.status}`;
            }
        })();
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_accounts_login_module_scss__WEBPACK_IMPORTED_MODULE_8___default().page),
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
                hidden: pageShowing !== "login-form",
                className: (_styles_accounts_login_module_scss__WEBPACK_IMPORTED_MODULE_8___default()["login-form"]),
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
                        className: (_styles_accounts_login_module_scss__WEBPACK_IMPORTED_MODULE_8___default()["error-label"]),
                        children: emailError
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
                        className: (_styles_accounts_login_module_scss__WEBPACK_IMPORTED_MODULE_8___default()["error-label"]),
                        children: passwordError
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__.Row, {
                        xs: "1",
                        sm: "1",
                        md: "2",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__.Col, {
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_5__.Button, {
                                onClick: handleLogin,
                                disabled: buttonLoading,
                                type: "submit",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                        hidden: buttonLoading,
                                        children: props.lang.login
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__.Spinner, {
                                        size: "sm",
                                        hidden: !buttonLoading,
                                        animation: "border"
                                    })
                                ]
                            })
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                        children: [
                            props.lang.doNotHaveAnAccount.split("&")[0],
                            " ",
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.Link, {
                                href: "/register",
                                children: props.lang.doNotHaveAnAccount.split("&")[1]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_5__.Container, {
                hidden: pageShowing !== "tfa-form",
                className: (_styles_accounts_login_module_scss__WEBPACK_IMPORTED_MODULE_8___default()["tfa-form"]),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                        children: props.lang.title
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", {
                        htmlFor: "tfa",
                        children: [
                            props.lang.tfa,
                            ": ",
                            props.lang.tfaHelp
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                        type: "text",
                        name: "tfa",
                        id: "tfa",
                        placeholder: "••••••"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("sub", {
                        className: (_styles_accounts_login_module_scss__WEBPACK_IMPORTED_MODULE_8___default()["error-label"]),
                        children: tfaError
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_5__.Button, {
                        onClick: handleLogin,
                        disabled: buttonLoading,
                        type: "submit",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                hidden: buttonLoading,
                                children: props.lang.submit
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__.Spinner, {
                                size: "sm",
                                hidden: !buttonLoading,
                                animation: "border"
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Login);


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
var __webpack_exports__ = __webpack_require__.X(0, [565], () => (__webpack_exec__(8346)));
module.exports = __webpack_exports__;

})();