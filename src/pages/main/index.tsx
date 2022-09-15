/* eslint-disable @next/next/no-img-element */
import React from "react";
import axios, { AxiosResponse } from "axios";

import { Row, Col } from "react-bootstrap";
import { Button, Container } from "@mui/material";
import Navbar from "../../components/navbar";
import Head from "next/head";

import { GetServerSideProps, NextPage } from "next";
import styles from "../../styles/main/index.module.scss";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    if (context.req.isAuthenticated())
        return {
            redirect: {
                destination: "/home",
                permanent: false,
            },
        };

    try {
        let languageResponse: AxiosResponse = await axios({
            method: "get",
            url: `${process.env.HOST}/api/content/language/`,
            params: {
                lang: context.req.headers["accept-language"].split(",")[0],
                category: "main",
                page: "welcome",
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

const Index: NextPage = (props: any) => {
    return (
        <div className={styles["page"]}>
            <Navbar lang={props.lang.navbar} user={null} />

            <div className={styles["content"]}>
                <div className={styles["header"]}>
                    <br />
                    <h1>DIMLIM</h1>
                    <br />
                    <p>
                        DIMLIM is an application made according to the different situations and comforts of the <br />
                        users of the different social networks that this would provide a very appropriate way to <br />
                        send your messages without worrying about security, privacy and trust.
                    </p>
                    <br />
                    <Row xs="1" sm="1" md="2" className={styles["header-buttons"]}>
                        <Col>
                            <Button variant="contained" href="/login" className={styles["header-button"]}>
                                Login
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="contained" href="/register" className={styles["header-button"]}>
                                Register
                            </Button>
                        </Col>
                    </Row>
                </div>

                <br />
                <br />
                <br />

                <div className={styles["main-content"]}>
                    <h1>DIMLIM</h1>
                </div>
            </div>
        </div>
    );
};

export default Index;
