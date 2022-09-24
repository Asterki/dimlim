/* eslint-disable @next/next/no-img-element */
import React from "react";
import axios, { AxiosResponse } from "axios";
import { io } from "socket.io-client";
import Push from "push.js";

import Head from "next/head";
import Navbar from "../../components/navbar";
import { Row, Col, Container } from "react-bootstrap";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, Box, IconButton, Tab, Button, Dialog, DialogTitle, DialogActions } from "@mui/material";

import styles from "../../styles/main/home.module.scss";
import { GetServerSideProps, NextPage } from "next";
import { Delete, Chat, DoDisturbOn, DoDisturbOff } from "@mui/icons-material";

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
    const [currentTab, setCurrentTab] = React.useState("1");

    const [addContactDialogOpen, setAddContactDialogOpen] = React.useState(false);
    const [contactDialogError, setContactDialogError] = React.useState("");

    const [reload, setReload] = React.useState(false);

    // Websocket
    const socket = io(props.host);

    React.useEffect(() => {
        Push.Permission.request();

        socket.on("connect", () => {
            socket.emit("join-home-page-listener", props.user.userID);

            socket.on("reload", (data) => {
                return setReload(true);
            });

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
    });

    // Button Action
    const addContact = async (event: any) => {
        let username = (document.querySelector("#dialog-username-username") as HTMLInputElement).value;

        if (!username) return setContactDialogError(props.lang.dialogs.addContact["missing-parameters"]);
        if (username.toLowerCase() == props.user.username) return setContactDialogError(props.lang.dialogs.addContact["self-add"]);

        if (
            props.user.contacts.find((listUser: any) => {
                return listUser.username.toLowerCase() == username.toLowerCase();
            }) !== undefined
        )
            return setContactDialogError(props.lang.dialogs.addContact["already-on-list"]);

        let response = await axios({
            method: "post",
            url: `${props.host}/api/users/add-contact`,
            data: {
                contact: username,
            },
        });

        if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);

        if (response.data.message == "success") {
            return window.location.reload();
        } else setContactDialogError(props.lang.dialogs.addContact[response.data.message]);
    };

    // Contact Actions
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
            return window.location.reload();
        }
    };

    const removeContact = async (event: any, username: string) => {
        let response = await axios({
            method: "post",
            url: `${props.host}/api/users/remove-contact`,
            data: {
                contact: username,
            },
        });

        if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);

        if (response.data.message == "success") {
            return window.location.reload();
        }
    };

    const unblockContact = async (event: any, username: string) => {
        let response = await axios({
            method: "post",
            url: `${props.host}/api/users/unblock-contact`,
            data: {
                contact: username,
            },
        });

        if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);

        if (response.data.message == "success") {
            return window.location.reload();
        }
    };

    const contactList = props.user.contacts.map((contact: { userID: string; username: string }) => {
        return (
            <div key={contact.username}>
                <Container fluid className={styles["contact"]}>
                    <Row>
                        <Col className={styles["contact-info"]}>
                            <Avatar src={`/avatars/${contact.userID}.png`} alt={`${contact.username} avatar`} />
                            <div className={styles["contact-general"]}>
                                <p className={styles["contact-username"]}>{contact.username}</p>
                            </div>
                        </Col>
                        <Col className={styles["actions-icon"]}>
                            <IconButton aria-label="Block Contact"  onClick={(event: any) => blockContact(event, contact.username)}>
                                <DoDisturbOn />
                            </IconButton>
                            <IconButton aria-label="Remove Contact" onClick={(event: any) => removeContact(event, contact.username)}>
                                <Delete />
                            </IconButton>
                            <IconButton aria-label="Open Chat" onClick={(event: any) => (window.location.href = `/chat/${contact.username}?id=${contact.userID}`)}>
                                <Chat />
                            </IconButton>
                        </Col>
                    </Row>
                </Container>
                <br />
            </div>
        );
    });

    const blockedContactList = props.user.blockedContacts.map((contact: { userID: string; username: string }) => {
        return (
            <div key={contact.username}>
                <Container fluid className={styles["contact"]}>
                    <Row>
                        <Col className={styles["contact-info"]}>
                            <Avatar src={`/avatars/${contact.userID}.png`} alt={`${contact.username} avatar`} />
                            <div className={styles["contact-general"]}>
                                <p className={styles["contact-username"]}>{contact.username}</p>
                            </div>
                        </Col>
                        <Col className={styles["actions-icon"]}>
                            <IconButton onClick={(event: any) => unblockContact(event, contact.username)}>
                                <DoDisturbOff />
                            </IconButton>
                        </Col>
                    </Row>
                </Container>
                <br />
            </div>
        );
    });

    React.useEffect(() => {
        if (reload == true) return window.location.reload();
    }, [reload]);

    return (
        <div className={styles["page"]}>
            <Navbar lang={props.lang.navbar} user={props.user} />

            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            <Dialog open={addContactDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.dialogs.addContact.title}</DialogTitle>

                    <p className={styles["dialog-label"]}>
                        <b>{props.lang.dialogs.addContact.label}</b>
                    </p>
                    <input id="dialog-username-username" type="text" />
                    <br />
                    <br />
                    <p className={styles["error"]}>{contactDialogError}</p>

                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setAddContactDialogOpen(false);
                            }}
                        >
                            {props.lang.dialogs.addContact.cancel}
                        </Button>
                        <Button onClick={addContact}>{props.lang.dialogs.addContact.add}</Button>
                    </DialogActions>
                </Container>
            </Dialog>

            <div className={styles["main-content"]}>
                <TabContext value={currentTab}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                            onChange={(event: any, newValue: string) => {
                                setCurrentTab(newValue);
                            }}
                            variant="fullWidth"
                        >
                            <Tab className={styles["tab"]} label={props.lang.contacts} value="1" />
                            <Tab className={styles["tab"]} label={props.lang.blocked} value="2" />
                        </TabList>
                    </Box>

                    {/* Contacts Page */}
                    <TabPanel value="1">
                        <Button variant="contained" onClick={() => setAddContactDialogOpen(true)} className={styles["add-contact-button"]}>
                            {props.lang.addContact}
                        </Button>

                        <br />
                        <br />

                        {props.user.contacts.length == 0 && (
                            <Container fluid className={styles["no-contacts"]}>
                                <p>{props.lang.noContacts}</p>
                            </Container>
                        )}

                        {props.user.contacts.length !== 0 && (
                            <Container fluid className={styles["contacts"]}>
                                {contactList}
                            </Container>
                        )}
                    </TabPanel>

                    {/* Blocked Contacts Page */}
                    <TabPanel value="2">
                        <br />

                        {props.user.blockedContacts.length == 0 && (
                            <Container fluid className={styles["no-contacts"]}>
                                <p>{props.lang.noBlockedContacts}</p>
                            </Container>
                        )}

                        {props.user.blockedContacts.length !== 0 && (
                            <Container fluid className={styles["contacts"]}>
                                <h2>{props.lang.blockedContacts}</h2>
                                <br />
                                {blockedContactList}
                            </Container>
                        )}
                    </TabPanel>
                </TabContext>
            </div>
        </div>
    );
};

export default Home;
