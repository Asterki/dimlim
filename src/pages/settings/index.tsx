import * as React from "react";
import axios, { AxiosResponse } from "axios";

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
    const [image, setImage] = React.useState("");
    const [text, setText] = React.useState("");

    const getSomething = async (event: any) => {
        let response: AxiosResponse = await axios({
            method: "post",
            url: `${props.host}/api/accounts/activate-tfa/`,
        });

        console.log(response.data);
        setImage(response.data.image);
        setText(response.data.code);
    };

    return (
        <div className={styles["page"]}>
            <Navbar loggedIn={true} lang={props.lang.navbar} user={props.user} />
            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            <Container className={styles["categories"]}>
                <div>
                    <form action="/api/upload/avatar" encType="multipart/form-data" method="POST">
                        <label htmlFor="files">Select files</label>
                        <input id="avatar" accept=".jpg, .png, .jpeg" name="avatar" type="file" />

                        <input type="submit" value="Upload Profile Picture" />
                    </form>

                    <br />
                    <br />
                    <br />
                    <br />
                    <button onClick={getSomething}>Activate Two Factor Authentication</button>
                    <img src={image} alt="" />
                    <p>{text}</p>
                </div>
            </Container>
        </div>
    );
};

export default Settings;
