(() => {
var exports = {};
exports.id = 403;
exports.ids = [403];
exports.modules = {

/***/ 9773:
/***/ ((module) => {

// Exports
module.exports = {
	"page": "home_page__5In93",
	"no-contacts": "home_no-contacts__vVwL4",
	"main-content": "home_main-content__bXZLI",
	"tab": "home_tab__7S23e",
	"add-contact-button": "home_add-contact-button__slRPj",
	"contacts": "home_contacts__bLWji",
	"contact": "home_contact__iyk3_",
	"contact-info": "home_contact-info__UWi3h",
	"contact-general": "home_contact-general__zuOLZ",
	"contact-username": "home_contact-username__3rILA",
	"actions-icon": "home_actions-icon__Lo6aU",
	"dialog-container": "home_dialog-container__Mbd76",
	"dialog": "home_dialog__YEkvc",
	"dialog-label": "home_dialog-label__ERsJs",
	"error": "home_error__lwaRa"
};


/***/ }),

/***/ 5632:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
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
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4612);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_navbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6565);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(358);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _mui_lab__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6072);
/* harmony import */ var _mui_lab__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_mui_lab__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7915);
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(9773);
/* harmony import */ var _styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([socket_io_client__WEBPACK_IMPORTED_MODULE_3__]);
socket_io_client__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
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
                category: "main",
                page: "home"
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
const Home = (props)=>{
    const [currentTab, setCurrentTab] = react__WEBPACK_IMPORTED_MODULE_1___default().useState("1");
    const [addContactDialogOpen, setAddContactDialogOpen] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);
    const [contactDialogError, setContactDialogError] = react__WEBPACK_IMPORTED_MODULE_1___default().useState("");
    const [reload, setReload] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);
    // Websocket
    const socket = (0,socket_io_client__WEBPACK_IMPORTED_MODULE_3__.io)(props.host);
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(()=>{
        socket.on("connect", ()=>{
            socket.emit("join-home-page-listener", props.user.userID);
            socket.on("reload", (data)=>{
                return setReload(true);
            });
        });
    });
    // Button Action
    const addContact = async (event)=>{
        let username = document.querySelector("#dialog-username-username").value;
        if (!username) return setContactDialogError(props.lang.dialogs.addContact["missing-parameters"]);
        if (username.toLowerCase() == props.user.username) return setContactDialogError(props.lang.dialogs.addContact["self-add"]);
        if (props.user.contacts.find((listUser)=>{
            return listUser.username.toLowerCase() == username.toLowerCase();
        }) !== undefined) return setContactDialogError(props.lang.dialogs.addContact["already-on-list"]);
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "post",
            url: `${props.host}/api/users/add-contact`,
            data: {
                contact: username
            }
        });
        if (response.data.code == 500) return window.location.href = `/error?id=${response.data.id}`;
        if (response.data.message == "success") {
            return window.location.reload();
        } else setContactDialogError(props.lang.dialogs.addContact[response.data.message]);
    };
    // Contact Actions
    const blockContact = async (event, username)=>{
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "post",
            url: `${props.host}/api/users/block-contact`,
            data: {
                contact: username
            }
        });
        if (response.data.code == 500) return window.location.href = `/error?id=${response.data.id}`;
        if (response.data.message == "success") {
            return window.location.reload();
        }
    };
    const removeContact = async (event, username)=>{
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "post",
            url: `${props.host}/api/users/remove-contact`,
            data: {
                contact: username
            }
        });
        if (response.data.code == 500) return window.location.href = `/error?id=${response.data.id}`;
        if (response.data.message == "success") {
            return window.location.reload();
        }
    };
    const unblockContact = async (event, username)=>{
        let response = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "post",
            url: `${props.host}/api/users/unblock-contact`,
            data: {
                contact: username
            }
        });
        if (response.data.code == 500) return window.location.href = `/error?id=${response.data.id}`;
        if (response.data.message == "success") {
            return window.location.reload();
        }
    };
    const contactList = props.user.contacts.map((contact)=>{
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default().contact),
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["contact-info"]),
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.Avatar, {
                                        src: `/avatars/${contact.userID}.png`
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["contact-general"]),
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["contact-username"]),
                                            children: contact.username
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["actions-icon"]),
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.IconButton, {
                                        onClick: (event)=>blockContact(event, contact.username),
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.DoDisturbOn, {})
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.IconButton, {
                                        onClick: (event)=>removeContact(event, contact.username),
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.Delete, {})
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.IconButton, {
                                        onClick: (event)=>window.location.href = `/chat/${contact.username}?id=${contact.userID}`,
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.Chat, {})
                                    })
                                ]
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {})
            ]
        }, contact.username);
    });
    const blockedContactList = props.user.blockedContacts.map((contact)=>{
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default().contact),
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Row, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["contact-info"]),
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.Avatar, {
                                        src: `/avatars/${contact.userID}.png`
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["contact-general"]),
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["contact-username"]),
                                            children: contact.username
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Col, {
                                className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["actions-icon"]),
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.IconButton, {
                                    onClick: (event)=>unblockContact(event, contact.username),
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_9__.DoDisturbOff, {})
                                })
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {})
            ]
        }, contact.username);
    });
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(()=>{
        if (reload == true) return window.location.reload();
    }, [
        reload
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default().page),
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
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.Dialog, {
                open: addContactDialogOpen,
                className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-container"]),
                sx: {
                    backgroundColor: "none"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                    fluid: true,
                    className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default().dialog),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.DialogTitle, {
                            children: props.lang.dialogs.addContact.title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["dialog-label"]),
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("b", {
                                children: props.lang.dialogs.addContact.label
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: "dialog-username-username",
                            type: "text"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default().error),
                            children: contactDialogError
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_8__.DialogActions, {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.Button, {
                                    onClick: (event)=>{
                                        setAddContactDialogOpen(false);
                                    },
                                    children: props.lang.dialogs.addContact.cancel
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.Button, {
                                    onClick: addContact,
                                    children: props.lang.dialogs.addContact.add
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["main-content"]),
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_lab__WEBPACK_IMPORTED_MODULE_7__.TabContext, {
                    value: currentTab,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.Box, {
                            sx: {
                                borderBottom: 1,
                                borderColor: "divider"
                            },
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_lab__WEBPACK_IMPORTED_MODULE_7__.TabList, {
                                onChange: (event, newValue)=>{
                                    setCurrentTab(newValue);
                                },
                                variant: "fullWidth",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.Tab, {
                                        className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default().tab),
                                        label: props.lang.contacts,
                                        value: "1"
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.Tab, {
                                        className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default().tab),
                                        label: props.lang.blocked,
                                        value: "2"
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_lab__WEBPACK_IMPORTED_MODULE_7__.TabPanel, {
                            value: "1",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.Button, {
                                    variant: "contained",
                                    onClick: ()=>setAddContactDialogOpen(true),
                                    className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["add-contact-button"]),
                                    children: props.lang.addContact
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                props.user.contacts.length == 0 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                    fluid: true,
                                    className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["no-contacts"]),
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                        children: props.lang.noContacts
                                    })
                                }),
                                props.user.contacts.length !== 0 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                    fluid: true,
                                    className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default().contacts),
                                    children: contactList
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_lab__WEBPACK_IMPORTED_MODULE_7__.TabPanel, {
                            value: "2",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                props.user.blockedContacts.length == 0 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                    fluid: true,
                                    className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default()["no-contacts"]),
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                        children: props.lang.noBlockedContacts
                                    })
                                }),
                                props.user.blockedContacts.length !== 0 && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__.Container, {
                                    fluid: true,
                                    className: (_styles_main_home_module_scss__WEBPACK_IMPORTED_MODULE_10___default().contacts),
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                            children: props.lang.blockedContacts
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                        blockedContactList
                                    ]
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ 4612:
/***/ ((module) => {

"use strict";
module.exports = import("socket.io-client");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [565], () => (__webpack_exec__(5632)));
module.exports = __webpack_exports__;

})();