/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import axios, { AxiosResponse } from "axios";

import Head from "next/head";
import Navbar from "../../components/navbar";

import { Container } from "react-bootstrap";
import { Box, Tabs, Tab, Button, IconButton, TextField, Modal, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { PhotoCamera } from "@mui/icons-material";

import styles from "../../styles/settings/index.module.scss";
import { GetServerSideProps, NextPage } from "next/types";

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
            method: "get",
            url: `${process.env.HOST}/api/content/language/`,
            params: {
                lang: context.req.headers["accept-language"].split(",")[0],
                category: "settings",
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

const Settings: NextPage = (props: any) => {
    const [activeTab, setActiveTab] = React.useState("1");
    const [codes, setCodes] = React.useState([]);
    const [image, setImage] = React.useState("");
    const [text, setText] = React.useState("");

    const activate = async (event: any) => {
        let response: AxiosResponse = await axios({
            method: "post",
            url: `${props.host}/api/accounts/activate-tfa/`,
        });

        console.log(response.data);
        setImage(response.data.image);
        setText(response.data.code);
    };

    const deactivate = async (event: any) => {
        let response: AxiosResponse = await axios({
            method: "post",
            url: `${props.host}/api/accounts/deactivate-tfa/`,
            data: {
                code: (document.querySelector("#yes") as HTMLInputElement).value,
            },
        });

        console.log(response.data);
    };

    const getCodes = async (event: any) => {
        console.log((document.querySelector("#maybe") as HTMLInputElement).value);

        let response: AxiosResponse = await axios({
            method: "post",
            url: `${props.host}/api/accounts/verify-tfa/`,
            data: {
                code: (document.querySelector("#maybe") as HTMLInputElement).value,
            },
        });

        console.log(response.data);
        setCodes(response.data);
    };

    const codeList = codes.map((code) => {
        return <li key={code}>{code}</li>;
    });

    return (
        <div className={styles["page"]}>
            <Navbar lang={props.lang.navbar} user={props.user} />
            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            <Container className={styles["categories"]}>
                <Modal open={false} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Text in a modal
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                    </Box>
                </Modal>

                <Box>
                    <TabContext value={activeTab}>
                        <Box sx={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", borderColor: "divider", padding: 0, margin: 0 }}>
                            <TabList
                                scrollButtons={true}
                                allowScrollButtonsMobile={true}
                                variant="scrollable"
                                onChange={(event: any, tab: any) => {
                                    setActiveTab(tab);
                                }}
                                aria-label="lab API tabs example"
                            >
                                <Tab label="General" value="1" />
                                <Tab label="Security" value="2" />
                                <Tab label="Privacy" value="3" />
                                <Tab label="Account" value="4" />
                                <Tab label="Notifications" value="5" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <h2>General Info:</h2>
                            <img width="200" src={`/avatars/${props.user.avatar}`} alt="Profile Picture" />
                            <br />
                            <br />
                            <h4>
                                <b>Username:</b> {props.user.username} <br />
                                <b>Email:</b> {props.user.email.value}
                                <br />
                                <b>Contacts:</b> 9 <br />
                                <b>Blocked Contacts:</b> 0 <br />
                                <b>Account creation date:</b> {props.user.creation} <br />
                                <b>Preferred Language:</b> German <br />

                            </h4>

                            <br />
                            <br />

                            {/* <form action="/api/upload/avatar" encType="multipart/form-data" method="POST">
                                <label htmlFor="files">Select files</label>
                                <input id="avatar" accept=".jpg, .png, .jpeg" name="avatar" type="file" />

                                <input type="submit" value="Upload Profile Picture" />
                            </form> */}
                        </TabPanel>
                        <TabPanel value="2">
                            <Button variant="contained" onClick={activate}>
                                Activate Two Factor Authentication
                            </Button>

                            <img src={image} alt="" />
                            <p>{text}</p>
                            <br />
                            <Button variant="contained" onClick={deactivate}>
                                Deactivate Two Factor Authentication
                            </Button>
                            <br />
                            <TextField id="yes" label="TFA Code" variant="standard" />

                            <br />
                            <br />

                            <Button variant="contained" onClick={getCodes}>
                                Get Two Factor Authentication Codes
                            </Button>
                            <br />
                            <TextField id="maybe" label="TFA Code" variant="standard" />
                            <ul>{codeList}</ul>
                        </TabPanel>
                        <TabPanel value="3">Privacy</TabPanel>
                        <TabPanel value="4">Account</TabPanel>
                    </TabContext>
                </Box>
            </Container>
        </div>
    );
};

export default Settings;
