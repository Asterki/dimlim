import React from "react";
import axios, { AxiosResponse } from "axios";
import { io } from "socket.io-client";
import crypto from "crypto";

import Head from "next/head";
import ChatNavbar from "../../components/chatNavbar";
import Message from "../../components/message";

import { IconButton, TextareaAutosize } from "@mui/material";
import { Container } from "react-bootstrap";
import { Send } from "@mui/icons-material";

import styles from "../../styles/chat.module.scss";
import { GetServerSideProps, NextPage, NextPageContext } from "next";

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
            url: `${process.env.HOST}/api/users/get-key`,
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

        let languageResponse: AxiosResponse = await axios({
            method: "post",
            url: `${process.env.HOST}/api/content/language/`,
            data: {
                lang: context.req.user.preferredLanguage == "" ? context.req.headers["accept-language"].split(",")[0] : context.req.user.preferredLanguage,
                category: "main",
                page: "home",
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
    content: string;
}

const Chat: NextPage = (props: any) => {
    const [messageList, setMessageList] = React.useState(new Array());
    const [pendingMessage, setPendingMessage] = React.useState({});

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

    const goBack = () => (window.location.href = "/home");
    const clear = () => localStorage.clear();

    // Listeners
    React.useEffect(() => {
        socket.on("connect", () => {
            socket.emit("join-chat", { user: props.user.username, contact: props.contact });
        });

        if (typeof window !== undefined) {
            let storedChatRaw = localStorage.getItem(`chat_${props.contact}`);
            if (!storedChatRaw) return;

            let storedChat = JSON.parse(storedChatRaw);
            setMessageList(storedChat);
        }
    }, []);

    React.useEffect(() => {
        // @ts-ignore
        if (pendingMessage.author == undefined) return;
        // @ts-ignore
        if (pendingMessage.fromStored == true) return addMessage(pendingMessage, true);
        else addMessage(pendingMessage, false);
    }, [pendingMessage]);

    return (
        <div className={styles["page"]}>
            <ChatNavbar return={goBack} contactUsername={props.contact} contactUserID={props.contactUserID} />
            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            <Container className={styles["messages"]}>
                <br />
                <p className={styles["intro"]}>This is the start of your chat</p>
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
            </Container>
            <Container fluid className={styles["chat-bar"]}>
                <TextareaAutosize className={styles["message-input"]} id="message-input" maxRows={3} placeholder="Message..." />
                <IconButton onClick={sendMessage}>
                    <Send />
                </IconButton>
                <IconButton onClick={clear}>
                    <Send />
                </IconButton>
            </Container>
        </div>
    );
};

export default Chat;
