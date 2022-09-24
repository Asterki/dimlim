import React from "react";
import axios, { AxiosResponse } from "axios";
import { io } from "socket.io-client";
import crypto from "crypto";
import Push from "push.js";
import { get, set } from "idb-keyval";

import Head from "next/head";
import ChatNavbar from "../../components/chatNavbar";
import Message from "../../components/message";

import { Avatar, Button, Dialog, DialogActions, DialogTitle, IconButton, Menu, MenuItem, TextareaAutosize } from "@mui/material";
import { Container } from "react-bootstrap";
import { Send, Attachment } from "@mui/icons-material";

import styles from "../../styles/chat.module.scss";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    if (!context.req.isAuthenticated())
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };

    if (!context.params.user || context.params.id)
        return {
            redirect: {
                destination: "/home",
                permanent: false,
            },
        };

    try {
        let keyResponse: AxiosResponse = await axios({
            method: "post",
            url: `${process.env.HOST}/api/messages/get-key`,
            headers: context.req.headers,
            data: {
                contact: context.params.user,
                user: context.req.user.username,
            },
        });

        if (keyResponse.data.message == "user-not-found") {
            return {
                redirect: {
                    destination: "/home",
                    permanent: false,
                },
            };
        }

        let newMessagesResponse: AxiosResponse = await axios({
            method: "post",
            url: `${process.env.HOST}/api/messages/get-pending-messages`,
            headers: context.req.headers,
            data: {
                chatName: [context.query.id, context.req.user.userID].sort().join("&"),
            },
        });

        let languageResponse: AxiosResponse = await axios({
            method: "post",
            url: `${process.env.HOST}/api/content/language/`,
            data: {
                lang: context.req.user.preferredLanguage == "" ? context.req.headers["accept-language"].split(",")[0] : context.req.user.preferredLanguage,
                category: "chat",
                page: "index",
            },
        });

        if (languageResponse.data.status !== 200) {
            return {
                redirect: {
                    destination: `/error?code=${languageResponse.data.status}`,
                    permanent: false,
                },
            };
        }

        return {
            props: {
                lang: languageResponse.data.content,
                user: context.req.user,
                host: process.env.HOST,
                contact: context.params.user,
                contactUserID: context.query.id,
                chatKey: keyResponse.data.message,
                newMessages: JSON.stringify(newMessagesResponse.data.content),
            },
        };
    } catch (err: any) {
        return {
            redirect: {
                destination: `/error?code=${err.response.status}`,
                permanent: false,
            },
        };
    }
};

interface Message {
    author: string;
    recipient: string;
    timestamp: number;
    content: any;
    new: boolean | undefined;
}

const Chat: NextPage = (props: any) => {
    const [messageList, setMessageList] = React.useState(new Array());
    const [pendingMessage, setPendingMessage] = React.useState({});

    // Dialogs
    const [contactInfoDialogOpen, setContactInfoDialogOpen] = React.useState(false);
    const [blockContactDialogOpen, setBlockContactDialogOpen] = React.useState(false);
    const [deleteChatDialogOpen, setDeleteChatDialogOpen] = React.useState(false);
    const [attachmentDialogOpen, setAttachmentDialogOpen] = React.useState(false);
    const [fileTooBigDialogOpen, setFileTooBigDialogOpen] = React.useState(false);

    // Attachments
    const [attachmentPreviewFile, setAttachmentPreviewFile] = React.useState({
        type: "",
        content: "",
        name: "",
    });

    // Messaging
    const socket = io(props.host);
    socket.on("message", (data: any) => {
        if (data.author == props.user.username) return;
        setPendingMessage(data);
    });

    const encrypt = (text: any) => {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-ctr", props.chatKey, iv);
        const encrypted = Buffer.concat([cipher.update(JSON.stringify(text)), cipher.final()]);

        return {
            iv: iv.toString("hex"),
            content: encrypted.toString("hex"),
        };
    };

    const decrypt = (hash: any) => {
        const decipher = crypto.createDecipheriv("aes-256-ctr", props.chatKey, Buffer.from(hash.iv, "hex"));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, "hex")), decipher.final()]);
        return JSON.parse(decrypted.toString());
    };

    const sendMessage = (data: any) => {
        addMessage(data, false);

        socket.emit("message", {
            author: props.user.username,
            recipient: props.contact,
            timestamp: Date.now(),
            message: encrypt(data.message),
        });
    };

    const addMessage: Function = async (data: any, fromSaved: boolean | undefined) => {
        // If the message comes from the other person
        if (data.author !== props.user.username && fromSaved == false) data.message = decrypt(data.message);

        // Add the message
        let newMessageList: Array<Message> = [...messageList, data];
        setMessageList(newMessageList);

        // Store message
        if (fromSaved == true) return;
        get(`chat_${props.contact}`).then((storedChatRaw: any) => {
            if (!storedChatRaw) storedChatRaw = "[]";

            let storedChat = JSON.parse(storedChatRaw);
            storedChat.push(data);
            set(`chat_${props.contact}`, JSON.stringify(storedChat));
        });
    };

    // Menu Actions
    const deleteChat = async () => {
        setDeleteChatDialogOpen(false);

        set(`chat_${props.contact}`, "[]").then(() => {
            return window.location.reload();
        });
    };
    const muteContact = () => {};

    // Navbar Actions
    const openContactInfoDialog = () => setContactInfoDialogOpen(true);
    const openBlockContactDialog = () => setBlockContactDialogOpen(true);
    const openDeleteChatDialog = () => setDeleteChatDialogOpen(true);

    const goBack = () => (window.location.href = "/home");

    // Listeners
    React.useEffect(() => {
        socket.on("connect", () => {
            socket.emit("join-chat", { user: props.user.username, contact: props.contact });

            // Other chat's notifications
            socket.on("notification", (data) => {
                if (Push.Permission.has()) {
                    Push.create(props.lang.newMessageNotification, {
                        body: data.content,
                        icon: "/icon.png",
                        timeout: 4000,
                        onClick: () => {
                            window.focus();
                            window.location.href = data.url;
                        },
                    });
                }
            });
        });

        // Load previous chat
        if (typeof window !== undefined) {
            (async () => {
                // Load previous chats
                await get(`chat_${props.contact}`).then((storedChatRaw: any) => {
                    if (!storedChatRaw) storedChatRaw = "[]";
                    let storedChat: Array<any> = JSON.parse(storedChatRaw);

                    // Load new chats
                    let parsedNewMessages = JSON.parse(props.newMessages);
                    parsedNewMessages.forEach((newMessage: any) => {
                        newMessage.message = decrypt(newMessage.message);
                        storedChat.push(newMessage);
                    });

                    setMessageList(storedChat);
                });
            })();
        }
    }, []);

    React.useEffect(() => {
        // @ts-ignore
        if (pendingMessage.author == undefined) return;
        // @ts-ignore
        if (pendingMessage.fromStored == true) return addMessage(pendingMessage, true);
        else addMessage(pendingMessage, false);
    }, [pendingMessage]);

    React.useEffect(() => {
        let chatBottom = document.querySelector("#chat-bottom") as HTMLDivElement;

        // Load video views
        setTimeout(() => {
            chatBottom.scrollIntoView();
        }, 500);
    }, [messageList]);

    return (
        <div className={styles["page"]}>
            <Head>
                <title>DIMLIM | Chat</title>
            </Head>

            <ChatNavbar
                returnAction={goBack}
                blockAction={openBlockContactDialog}
                deleteAction={openDeleteChatDialog}
                infoAction={openContactInfoDialog}
                muteAction={muteContact}
                contactUsername={props.contact}
                contactUserID={props.contactUserID}
            />

            <Dialog
                open={contactInfoDialogOpen}
                onClose={() => {
                    setContactInfoDialogOpen(false);
                }}
                className={styles["dialog-container"]}
                sx={{ backgroundColor: "none" }}
            >
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.contact}</DialogTitle>

                    <Avatar sx={{ width: 200, height: 200 }} src={`/avatars/${props.contactUserID}.png`} />

                    <br />

                    <Button
                        onClick={(event: any) => {
                            setContactInfoDialogOpen(false);
                        }}
                    >
                        {props.lang.dialogs.profile.done}
                    </Button>
                    <br />
                </Container>
            </Dialog>

            <Dialog
                open={blockContactDialogOpen}
                onClose={() => {
                    setBlockContactDialogOpen(false);
                }}
                className={styles["dialog-container"]}
            >
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.contact}</DialogTitle>
                    <p>{props.lang.dialogs.block.warning}</p>

                    <DialogActions>
                        <Button
                            onClick={async (event: any) => {
                                setBlockContactDialogOpen(false);
                                let response = await axios({
                                    method: "post",
                                    url: `${props.host}/api/users/block-contact`,
                                    data: {
                                        contact: props.contact,
                                    },
                                });

                                if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);

                                if (response.data.message == "success") {
                                    return (window.location.href = "/home");
                                }
                            }}
                        >
                            {props.lang.dialogs.block.block}
                        </Button>
                        <Button
                            onClick={(event: any) => {
                                setBlockContactDialogOpen(false);
                            }}
                        >
                            {props.lang.dialogs.block.cancel}
                        </Button>
                    </DialogActions>
                </Container>
            </Dialog>

            <Dialog
                open={deleteChatDialogOpen}
                onClose={() => {
                    setDeleteChatDialogOpen(false);
                }}
                className={styles["dialog-container"]}
                sx={{ backgroundColor: "none" }}
            >
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.dialogs.delete.title}</DialogTitle>

                    <p>{props.lang.dialogs.delete.warning}</p>

                    <DialogActions>
                        <Button onClick={deleteChat}>{props.lang.dialogs.delete.delete}</Button>
                        <Button
                            onClick={(event: any) => {
                                setDeleteChatDialogOpen(false);
                            }}
                        >
                            {props.lang.dialogs.delete.cancel}
                        </Button>
                    </DialogActions>
                </Container>
            </Dialog>

            <Dialog
                open={attachmentDialogOpen}
                onClose={() => {
                    setDeleteChatDialogOpen(false);
                }}
                className={styles["dialog-container"]}
                sx={{ backgroundColor: "none" }}
            >
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.dialogs.attachment.title}</DialogTitle>

                    <p>
                        {props.lang.dialogs.attachment.warning} {props.contact}
                    </p>

                    {attachmentPreviewFile.type == "image" && <img className={styles["attachment-image"]} src={attachmentPreviewFile.content} alt="image" />}
                    {attachmentPreviewFile.type == "video" && <video controls className={styles["attachment-image"]} src={attachmentPreviewFile.content} />}
                    {attachmentPreviewFile.type !== "video" && attachmentPreviewFile.type !== "image" && (
                        <p className={styles["no-file-preview"]}>{props.lang.dialogs.attachment.noPreview}</p>
                    )}

                    <br />

                    <TextareaAutosize className={styles["message-input"]} id="attachment-caption" maxRows={3} placeholder={props.lang.placeholder} />

                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setAttachmentDialogOpen(false);
                                setAttachmentPreviewFile({
                                    type: "",
                                    content: "",
                                    name: "",
                                });
                            }}
                        >
                            {props.lang.dialogs.attachment.cancel}
                        </Button>
                        <Button
                            onClick={(event: any) => {
                                let fileType = attachmentPreviewFile.type;
                                if (attachmentPreviewFile.type !== "video" && attachmentPreviewFile.type !== "image") fileType = "file";

                                sendMessage({
                                    author: props.user.username,
                                    recipient: props.contact,
                                    timestamp: Date.now(),
                                    message: {
                                        type: fileType,
                                        content: attachmentPreviewFile.content,
                                        name: attachmentPreviewFile.name,
                                        caption: (document.querySelector("#attachment-caption") as HTMLInputElement).value,
                                    },
                                });
                                setAttachmentDialogOpen(false);
                            }}
                        >
                            {props.lang.dialogs.attachment.send}
                        </Button>
                    </DialogActions>
                </Container>
            </Dialog>

            <Dialog
                open={fileTooBigDialogOpen}
                onClose={() => {
                    setDeleteChatDialogOpen(false);
                }}
                className={styles["dialog-container"]}
                sx={{ backgroundColor: "none" }}
            >
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>Send Image</DialogTitle>

                    <p>The image you selected is too big, it must be under 5mb</p>

                    <Button
                        onClick={(event: any) => {
                            setFileTooBigDialogOpen(false);
                        }}
                    >
                        Ok
                    </Button>
                </Container>
            </Dialog>

            <Container className={styles["messages"]} id="chat">
                <br />
                <p className={styles["intro"]}>{props.lang.intro}</p>
                <br />
                {messageList.map((data: any) => {
                    return (
                        <Message
                            key={`${Math.random() * 1000} ${data.timestamp}`}
                            timestamp={data.timestamp}
                            sentByMe={data.author == props.user.username}
                            content={data.message.content}
                            name={data.message.name ? data.message.name : undefined}
                            caption={data.message.caption ? data.message.caption : undefined}
                            type={data.message.type}
                        />
                    );
                })}
                <br />
                <br />
                <br />
                <div id="chat-bottom" />
            </Container>
            <Container fluid className={styles["chat-bar"]}>
                <TextareaAutosize className={styles["message-input"]} id="message-input" maxRows={3} placeholder={props.lang.placeholder} />
                <IconButton
                    onClick={() => {
                        (document.querySelector("#attachment-input") as HTMLInputElement).click();
                    }}
                >
                    <Attachment />
                </IconButton>
                <IconButton
                    onClick={() => {
                        (document.querySelector("#message-input") as HTMLInputElement).focus();
                        let messageContent = (document.querySelector("#message-input") as HTMLTextAreaElement).value;
                        if (!messageContent) return;
                        (document.querySelector("#message-input") as HTMLInputElement).value = "";

                        sendMessage({
                            author: props.user.username,
                            recipient: props.contact,
                            timestamp: Date.now(),
                            message: {
                                type: "text",
                                content: messageContent,
                            },
                        });
                    }}
                >
                    <Send />
                </IconButton>
            </Container>

            <form action="" hidden>
                <input
                    onChange={(event: any) => {
                        let file = (document.querySelector("#attachment-input") as any).files[0];
                        if (file.size > 20000000) return setFileTooBigDialogOpen(false);

                        let reader = new FileReader();

                        reader.onloadend = () => {
                            setAttachmentPreviewFile({
                                type: file.type.split("/")[0] as string,
                                content: reader.result as string,
                                name: file.name,
                            });
                        };

                        if (file) {
                            setAttachmentDialogOpen(true);
                            reader.readAsDataURL(file);
                        } else {
                            setAttachmentDialogOpen(false);
                            setAttachmentPreviewFile({
                                type: "",
                                content: "",
                                name: "",
                            });
                        }
                    }}
                    id="attachment-input"
                    name="file"
                    type="file"
                />
            </form>
        </div>
    );
};

export default Chat;
