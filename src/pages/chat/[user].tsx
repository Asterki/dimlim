import React from "react";
import axios, { AxiosResponse } from "axios";
import { io } from "socket.io-client";

import Head from "next/head";
import ChatNavbar from "../../components/chatNavbar";

import { IconButton } from "@mui/material";
import { Container } from "react-bootstrap";
import { Send, WindowOutlined } from "@mui/icons-material";

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

const Chat: NextPage = (props: any) => {
    const [messageList, setMessageList] = React.useState([]);

    const socket = io(props.host);

    React.useEffect(() => {
        socket.on("connect", () => {
            socket.emit("join-chat", { user: props.user.username, contact: props.contact });
        });
    });

    socket.on("message", (data: any) => {
        // @ts-ignore
        messageList.push(data);
        setMessageList(messageList);
    });

    const sendMessage = () => {
        let messageContent = (document.querySelector("#something-random") as HTMLInputElement).value;
        if (!messageContent) return;

        (document.querySelector("#something-random") as HTMLInputElement).value = "";

        let newMessageList: any = messageList
        newMessageList.push({
            author: props.user.username,
            recipient: props.contact,
            message: messageContent,
        });

        setMessageList(newMessageList);

        // socket.emit("message", {e
        //     author: props.user.username,
        //     recipient: props.contact,
        //     message: messageContent,
        // });
    };

    const goBack = () => (window.location.href = "/home");

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
                        <li key={message.message}>
                            {message.author}: {message.message}
                        </li>
                    );
                })}
            </Container>

            <Container fluid className={styles["chat-bar"]}>
                <textarea maxLength={2000} placeholder="Message..." id="something-random" />
                <IconButton onClick={sendMessage}>
                    <Send />
                </IconButton>
            </Container>
        </div>
    );
};

export default Chat;
