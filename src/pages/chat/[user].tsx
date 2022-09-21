import React from "react";
import axios, { AxiosResponse } from "axios";
import { io } from "socket.io-client";
import crypto from "crypto";

import Head from "next/head";
import ChatNavbar from "../../components/chatNavbar";
import Message from "../../components/message";

import { Button, Dialog, DialogTitle, IconButton, TextareaAutosize } from "@mui/material";
import { Container } from "react-bootstrap";
import { Send } from "@mui/icons-material";

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

    if (!context.params.user)
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
                newMessages: newMessagesResponse.data.content,
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
    const [contactProfileDialogOpen, setContactProfileDialogOpen] = React.useState(false);

    // Socket.io
    const socket = io(props.host);

    socket.on("message", (data: any) => {
        if (data.author == props.user.username) return;
        setPendingMessage(data);
    });

    const encrypt = (text: any) => {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-ctr", props.chatKey, iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return {
            iv: iv.toString("hex"),
            content: encrypted.toString("hex"),
        };
    };

    const decrypt = (hash: any) => {
        const decipher = crypto.createDecipheriv("aes-256-ctr", props.chatKey, Buffer.from(hash.iv, "hex"));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, "hex")), decipher.final()]);
        return decrypted.toString();
    };

    // Functions
    const sendMessage = (e: any) => {
        (document.querySelector("#message-input") as HTMLInputElement).focus();
        let messageContent = (document.querySelector("#message-input") as HTMLTextAreaElement).value;
        if (!messageContent) return;

        (document.querySelector("#message-input") as HTMLInputElement).value = "";
        addMessage({
            author: props.user.username,
            recipient: props.contact,
            timestamp: Date.now(),
            content: messageContent,
        });

        socket.emit("message", {
            author: props.user.username,
            recipient: props.contact,
            timestamp: Date.now(),
            content: encrypt(messageContent),
        });
    };

    const addMessage: Function = (data: any, fromSaved: boolean | undefined) => {
        if (data.author !== props.user.username && fromSaved == false) data.content = decrypt(data.content);
        let newMessageList: Array<Message> = [...messageList, data];
        setMessageList(newMessageList);

        // Store message
        let storedChatRaw = localStorage.getItem(`chat_${props.contact}`);
        if (!storedChatRaw) storedChatRaw = "[]";

        if (fromSaved == true) return;

        let storedChat = JSON.parse(storedChatRaw);
        storedChat.push(data);
        localStorage.setItem(`chat_${props.contact}`, JSON.stringify(storedChat));
    };

    // Buttons and all
    const goBack = () => (window.location.href = "/home");
    const openContactDialog = () => setContactProfileDialogOpen(true);
    const deleteChat = () => {
        localStorage.setItem(`chat_${props.contact}`, "[]");
        return window.location.reload();
    };
    const blockContact = async (event: any, username: string) => {
        let response = await axios({
            method: "post",
            url: `${props.host}/api/users/block-contact`,
            data: {
                contact: username,
            },
        });

        if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);

        if (response.data.message == "success") {
            return (window.location.href = "/home");
        }
    };

    // Listeners
    React.useEffect(() => {
        socket.on("connect", () => {
            socket.emit("join-chat", { user: props.user.username, contact: props.contact });
        });

        // Load previous chat
        if (typeof window !== undefined) {
            (async () => {
                // Load previous chats
                let storedChatRaw = localStorage.getItem(`chat_${props.contact}`);
                if (!storedChatRaw) storedChatRaw = "[]";
                let storedChat: Array<any> = JSON.parse(storedChatRaw);
                setMessageList(storedChat);

                // Load new chats
                if (!props.newMessages.length) return;
                props.newMessages.forEach((newMessage: Message) => {
                    if (newMessage.content.iv == undefined) return;
                    addMessage(newMessage, false);
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
        chatBottom.scrollIntoView();
    }, [messageList]);

    return (
        <div className={styles["page"]}>
            <ChatNavbar return={goBack} openContactDialog={openContactDialog} contactUsername={props.contact} contactUserID={props.contactUserID} />
            <Head>
                <title>DIMLIM | {props.contact}</title>
            </Head>

            <Dialog open={contactProfileDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.contact}</DialogTitle>

                    <Button onClick={deleteChat}>{props.lang.dialog.delete}</Button>
                    <br />

                    <Button
                        onClick={(e: any) => {
                            blockContact(e, props.contact);
                        }}
                    >
                        {props.lang.dialog.block}
                    </Button>
                    <br />

                    <Button
                        onClick={(event: any) => {
                            setContactProfileDialogOpen(false);
                        }}
                    >
                        {props.lang.dialog.cancel}
                    </Button>
                    <br />
                </Container>
            </Dialog>

            <Container className={styles["messages"]} id="chat">
                <br />
                <p className={styles["intro"]}>{props.lang.intro}</p>
                <br />
                {messageList.map((message: any) => {
                    return (
                        <Message
                            key={`${Math.random() * 1000} ${message.author}`}
                            timestamp={message.timestamp}
                            sentByMe={message.author == props.user.username}
                            content={message.content}
                            type="text"
                        />
                    );
                })}
                <br />
                <br />
                <br />
                <div id="chat-bottom" />
            </Container>
            <Container fluid className={styles["chat-bar"]}>
                <TextareaAutosize className={styles["message-input"]} id="message-input" maxRows={3} placeholder={props.lang.placeholder} disabled={true} />
                <IconButton onClick={sendMessage}>
                    <Send />
                </IconButton>
            </Container>
        </div>
    );
};

export default Chat;
