(() => {
var exports = {};
exports.id = 658;
exports.ids = [658];
exports.modules = {

/***/ 0:
/***/ ((module) => {

// Exports
module.exports = {
	"component": "chatNavbar_component__etMbJ",
	"contact-info": "chatNavbar_contact-info__pupUH",
	"contact-general": "chatNavbar_contact-general__ZoKzI",
	"contact-username": "chatNavbar_contact-username__6HcK8",
	"contact-avatar": "chatNavbar_contact-avatar__Zf2bK"
};


/***/ }),

/***/ 6173:
/***/ ((module) => {

// Exports
module.exports = {
	"component": "message_component__GVaMC",
	"by-me": "message_by-me__Du9h9",
	"content": "message_content__BryaQ",
	"timestamp": "message_timestamp__Jbq6C",
	"not-by-me": "message_not-by-me__7w_fU"
};


/***/ }),

/***/ 9399:
/***/ ((module) => {

// Exports
module.exports = {
	"page": "chat_page__MxOtX",
	"intro": "chat_intro__t5J12",
	"chat-bar": "chat_chat-bar__yaeYo",
	"message-input": "chat_message-input__UawLr"
};


/***/ }),

/***/ 1625:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7915);
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _chatNavbar_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(0);
/* harmony import */ var _chatNavbar_module_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_chatNavbar_module_scss__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_3__);





const ChatNavarComponent = (props)=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: (_chatNavbar_module_scss__WEBPACK_IMPORTED_MODULE_4___default().component),
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: (_chatNavbar_module_scss__WEBPACK_IMPORTED_MODULE_4___default()["contact-info"]),
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.IconButton, {
                    onClick: props.return,
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.ChevronLeft, {})
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Avatar, {
                    className: (_chatNavbar_module_scss__WEBPACK_IMPORTED_MODULE_4___default()["contact-avatar"]),
                    src: `/avatars/${props.contactUserID}.png`
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: (_chatNavbar_module_scss__WEBPACK_IMPORTED_MODULE_4___default()["contact-general"]),
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                        className: (_chatNavbar_module_scss__WEBPACK_IMPORTED_MODULE_4___default()["contact-username"]),
                        children: props.contactUsername
                    })
                })
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatNavarComponent);


/***/ }),

/***/ 3793:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _message_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6173);
/* harmony import */ var _message_module_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_message_module_scss__WEBPACK_IMPORTED_MODULE_2__);



const MessageComponent = (props)=>{
    let date = new Date(props.timestamp);
    let hour = date.getHours();
    let minute = date.getMinutes().toString().length == 1 ? `0${date.getMinutes().toString()}` : date.getMinutes();
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: (_message_module_scss__WEBPACK_IMPORTED_MODULE_2___default().component),
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: props.sentByMe ? (_message_module_scss__WEBPACK_IMPORTED_MODULE_2___default()["by-me"]) : (_message_module_scss__WEBPACK_IMPORTED_MODULE_2___default()["not-by-me"]),
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_message_module_scss__WEBPACK_IMPORTED_MODULE_2___default().content),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                        children: props.content
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                        className: (_message_module_scss__WEBPACK_IMPORTED_MODULE_2___default().timestamp),
                        children: `${hour}:${minute}`
                    })
                ]
            })
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MessageComponent);


/***/ }),

/***/ 8763:
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
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6113);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_chatNavbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1625);
/* harmony import */ var _components_message__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3793);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(358);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(7915);
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _styles_chat_module_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(9399);
/* harmony import */ var _styles_chat_module_scss__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_styles_chat_module_scss__WEBPACK_IMPORTED_MODULE_11__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([socket_io_client__WEBPACK_IMPORTED_MODULE_3__]);
socket_io_client__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];












const getServerSideProps = async (context)=>{
    if (!context.req.isAuthenticated()) return {
        redirect: {
            destination: "/login",
            permanent: false
        }
    };
    if (!context.params.user) return {
        redirect: {
            destination: "/home",
            permanent: false
        }
    };
    try {
        let keyResponse = await axios__WEBPACK_IMPORTED_MODULE_2___default()({
            method: "post",
            url: `${process.env.HOST}/api/users/get-key`,
            headers: context.req.headers,
            data: {
                contact: context.params.user,
                user: context.req.user.username
            }
        });
        if (keyResponse.data.message == "user-not-found") {
            return {
                redirect: {
                    destination: "/home",
                    permanent: false
                }
            };
        }
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
                host: process.env.HOST,
                contact: context.params.user,
                contactUserID: context.query.id,
                chatKey: keyResponse.data.message
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
const Chat = (props)=>{
    const [messageList, setMessageList] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(new Array());
    const [pendingMessage, setPendingMessage] = react__WEBPACK_IMPORTED_MODULE_1___default().useState({});
    // Socket.io
    const socket = (0,socket_io_client__WEBPACK_IMPORTED_MODULE_3__.io)(props.host);
    socket.on("message", (data)=>{
        if (data.author == props.user.username) return;
        setPendingMessage(data);
    });
    const encrypt = (text)=>{
        const iv = crypto__WEBPACK_IMPORTED_MODULE_4___default().randomBytes(16);
        const cipher = crypto__WEBPACK_IMPORTED_MODULE_4___default().createCipheriv("aes-256-ctr", props.chatKey, iv);
        const encrypted = Buffer.concat([
            cipher.update(text),
            cipher.final()
        ]);
        return {
            iv: iv.toString("hex"),
            content: encrypted.toString("hex")
        };
    };
    const decrypt = (hash)=>{
        const decipher = crypto__WEBPACK_IMPORTED_MODULE_4___default().createDecipheriv("aes-256-ctr", props.chatKey, Buffer.from(hash.iv, "hex"));
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(hash.content, "hex")),
            decipher.final()
        ]);
        return decrypted.toString();
    };
    // Functions
    const sendMessage = (e)=>{
        document.querySelector("#message-input").focus();
        let messageContent = document.querySelector("#message-input").value;
        if (!messageContent) return;
        document.querySelector("#message-input").value = "";
        addMessage({
            author: props.user.username,
            recipient: props.contact,
            timestamp: Date.now(),
            content: messageContent
        });
        socket.emit("message", {
            author: props.user.username,
            recipient: props.contact,
            timestamp: Date.now(),
            content: encrypt(messageContent)
        });
    };
    const addMessage = (data, fromSaved)=>{
        if (data.author !== props.user.username && fromSaved == false) data.content = decrypt(data.content);
        let newMessageList = [
            ...messageList,
            data
        ];
        setMessageList(newMessageList);
        // Store message
        let storedChatRaw = localStorage.getItem(`chat_${props.contact}`);
        if (!storedChatRaw) storedChatRaw = "[]";
        if (fromSaved == true) return;
        let storedChat = JSON.parse(storedChatRaw);
        storedChat.push(data);
        localStorage.setItem(`chat_${props.contact}`, JSON.stringify(storedChat));
    };
    const goBack = ()=>window.location.href = "/home";
    const clear = ()=>localStorage.clear();
    // Listeners
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(()=>{
        socket.on("connect", ()=>{
            socket.emit("join-chat", {
                user: props.user.username,
                contact: props.contact
            });
        });
        if (true) {
            let storedChatRaw = localStorage.getItem(`chat_${props.contact}`);
            if (!storedChatRaw) return;
            let storedChat = JSON.parse(storedChatRaw);
            setMessageList(storedChat);
        }
    }, []);
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(()=>{
        // @ts-ignore
        if (pendingMessage.author == undefined) return;
        // @ts-ignore
        if (pendingMessage.fromStored == true) return addMessage(pendingMessage, true);
        else addMessage(pendingMessage, false);
    }, [
        pendingMessage
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_chat_module_scss__WEBPACK_IMPORTED_MODULE_11___default().page),
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_chatNavbar__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
                return: goBack,
                contactUsername: props.contact,
                contactUserID: props.contactUserID
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_head__WEBPACK_IMPORTED_MODULE_5___default()), {
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("title", {
                    children: props.lang.pageTitle
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__.Container, {
                className: (_styles_chat_module_scss__WEBPACK_IMPORTED_MODULE_11___default().messages),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                        className: (_styles_chat_module_scss__WEBPACK_IMPORTED_MODULE_11___default().intro),
                        children: "This is the start of your chat"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    messageList.map((message)=>{
                        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_message__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z, {
                            timestamp: message.timestamp,
                            sentByMe: message.author == props.user.username,
                            content: message.content,
                            type: "text"
                        }, `${Math.random() * 1000} ${message.author}`);
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {})
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__.Container, {
                fluid: true,
                className: (_styles_chat_module_scss__WEBPACK_IMPORTED_MODULE_11___default()["chat-bar"]),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.TextareaAutosize, {
                        className: (_styles_chat_module_scss__WEBPACK_IMPORTED_MODULE_11___default()["message-input"]),
                        id: "message-input",
                        maxRows: 3,
                        placeholder: "Message..."
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.IconButton, {
                        onClick: sendMessage,
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_10__.Send, {})
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_8__.IconButton, {
                        onClick: clear,
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_icons_material__WEBPACK_IMPORTED_MODULE_10__.Send, {})
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Chat);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7915:
/***/ ((module) => {

"use strict";
module.exports = require("@mui/icons-material");

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

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(8763));
module.exports = __webpack_exports__;

})();