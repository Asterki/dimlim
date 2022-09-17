import * as React from "react";
import axios, { AxiosResponse } from "axios";

import { Container } from "react-bootstrap";

import Navbar from "../../components/navbar";
import Head from "next/head";

import styles from "../../styles/accounts/verify-email.module.scss";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    try {
        // Get the language pack
        let languageResponse: AxiosResponse = await axios({
            method: "post",
            url: `${process.env.HOST}/api/content/language/`,
            data: {
                lang: context.req.headers["accept-language"].split(",")[0],
                category: "accounts",
                page: "verifyEmail",
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

        let message = languageResponse.data.content.invalid;
        if (context.query.expired == "true") message = languageResponse.data.content.expired;
        if (context.query.invalid == "true") message = languageResponse.data.content.invalid;
        if (context.query.success == "true")
            message = context.req.isAuthenticated() == true ? languageResponse.data.content.successLoggedIn : languageResponse.data.content.successNotLoggedIn;

        return {
            props: {
                lang: languageResponse.data.content,
                user: context.req.isAuthenticated() == true ? context.req.user : null,
                message: message,
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

const VerifyEmail: NextPage = (props: any) => {
    return (
        <div className={styles["page"]}>
            <Navbar lang={props.lang.navbar} user={props.user} />

            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            <Container fluid className={styles["message"]}>
                <p>{props.message}</p>

                <a href={props.user == null ? "/login" : "/home"}>{props.user == null ? props.lang.login : props.lang.goHome}</a>
            </Container>
        </div>
    );
};

export default VerifyEmail;
