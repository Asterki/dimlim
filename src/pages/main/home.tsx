/* eslint-disable @next/next/no-img-element */
import React from "react";
import axios, { AxiosResponse } from "axios";
import io from "socket.io-client";

import { Row, Col, Button, Container, Spinner, CloseButton } from "react-bootstrap";
import Head from "next/head";
import Navbar from "../../components/navbar";

import styles from "../../styles/main/home.module.scss";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    if (!context.req.isAuthenticated())
        return {
            redirect: {
                destination: "/login",
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

const Home: NextPage = (props: any) => {
    const [messages, setMessages] = React.useState(["Welcome to chat"]);

    const socket = io();

    const sendMessage = (e: any) => {
        let messageToSend = `${props.user.username}: ${(document.querySelector("#something") as HTMLInputElement).value}`;
        socket.emit("chat message", messageToSend);

        setMessages([...messages, messageToSend]);
    };

    socket.on("chat message", (data) => {
        setMessages([...messages, data]);
    });

    let messagesToShow = messages.map((message) => {
        let key = Math.random();
        return <li key={key}>{message}</li>;
    });

    return (
        <div className={styles["page"]}>
            <Navbar lang={props.lang.navbar} user={props.user} />
            <input type="text" id="something" /> <button onClick={sendMessage}>Send</button>
            <ul>{messagesToShow}</ul>
            <br />
            {/* <img src={`/avatars/${props.user.userID}.png`} alt="yeah" /> */}
            <br />
        </div>
    );
};

export default Home;
