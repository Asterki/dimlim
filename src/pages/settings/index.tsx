import * as React from "react";
import axios from "axios";

import Head from "next/head";
import Navbar from "../../components/navbar";
import { Container } from "react-bootstrap";

import styles from "../../styles/settings/index.module.scss";
import { GetServerSideProps, NextPage } from "next/types";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    if (context.req.user == undefined)
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };

    try {
        let languageResponse: any = await axios({
            method: "get",
            url: `${process.env.HOST}/api/content/language/`,
            params: {
                lang: context.req.headers["accept-language"].split(",")[0],
                category: "settings",
                page: "index",
            },
        });

        return {
            props: {
                lang: languageResponse.data,
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
    return (
        <div className={styles["page"]}>
            <Navbar loggedIn={true} lang={props.lang.navbar} user={props.user} />
            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            <Container className={styles["categories"]}>
            <div className="input-group">
                <label htmlFor="files">Select files</label>
                <input id='files' accept=".jpg, .png, .jpeg, .bmp, .tif, .tiff|image/*" type="file" />
                <button>Yes</button>
            </div>
            </Container>
        </div>
    );
};

export default Settings;
