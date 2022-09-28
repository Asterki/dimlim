/* eslint-disable @next/next/no-img-element */
import React from "react";
import axios, { AxiosResponse } from "axios";

import { Container } from "react-bootstrap";
import { Button } from "@mui/material";
import Navbar from "../../components/navbar";

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
            method: "post",
            url: `${process.env.HOST}/api/content/language/`,
            data: {
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
        console.log(err);

        return {
            redirect: {
                destination: `/error?code=${err.response.status}`,
                permanent: false,
            },
        };
    }
};

const IndexPage: NextPage = (props: any) => {
    return (
        <div className={styles["page"]}>
            <Navbar lang={props.lang.navbar} user={null} />

            <div className={styles["content"]}>
                <div className={styles["header"]}>
                    <br />
                    <h1>DIMLIM</h1>
                    <br />

                    <img src="/icon.png" alt="Icon png" />
                </div>

                <br />
                <br />
                <br />

                <Container className={styles["main-content"]}>
                    <img src="../../assets/images/shield-line.png" alt="Shield" />
                    <h1>{props.lang.security}</h1>
                    <p> {props.lang.securityDesc}</p>

                    <br />
                    <br />

                    <img src="../../assets/images/user-box-line.png" alt="Privacy" />
                    <h1>{props.lang.privacy}</h1>
                    <p>
                        {props.lang.privacyDesc.split("&")[0]}
                        <a href="https://github.com/Asterki/dimlim">{props.lang.privacyDesc.split("&")[1]}</a>
                        {props.lang.privacyDesc.split("&")[2]}
                    </p>

                    <br />
                    <br />

                    <img src="../../assets/images/airplane-flight-2-line.png" alt="Velocity" />
                    <h1>{props.lang.velocity}</h1>
                    <p>{props.lang.velocityDesc}</p>
                </Container>

                <br />
                <br />
                <br />

                <div className={styles["footer"]}>
                    <Button variant="contained" href="/register">
                        {props.lang.navbar.register}
                    </Button>
                    <br />
                    <br />
                    <Button variant="contained" href="/login">
                        {props.lang.navbar.login}
                    </Button>

                    <br />
                    <br />
                    <br />
                    <p>Copyright© 2022 DIMLIM Team</p>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
