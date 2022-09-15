import * as React from "react";
import axios, { AxiosResponse } from "axios";
import validator from "validator";

import { Row, Col, Spinner } from "react-bootstrap";
import { Container, Button, Link } from "@mui/material";

import Head from "next/head";
import Navbar from "../../components/navbar";

import styles from "../../styles/accounts/login.module.scss";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    // If the user is already logged in, it will redirect to the main page instead
    if (context.req.isAuthenticated())
        return {
            redirect: {
                destination: "/home",
                permanent: false,
            },
        };

    try {
        // Get the language pack
        let languageResponse: AxiosResponse = await axios({
            method: "get",
            url: `${process.env.HOST}/api/content/language/`,
            params: {
                lang: context.req.headers["accept-language"].split(",")[0],
                category: "accounts",
                page: "login",
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

const Login: NextPage = (props: any) => {
    // Error states
    const [buttonLoading, setButtonLoading] = React.useState(false);
    const [emailError, setEmailError] = React.useState<string | null>(null);
    const [passwordError, setPasswordError] = React.useState<string | null>(null);
    const [tfaError, setTfaError] = React.useState<string | null>(null);

    // Page that is showing
    const [pageShowing, setPageShowing] = React.useState("login-form");

    // When login button clicked
    const handleLogin = async (e: any) => {
        // Reset errors, and set the button to load

        e.preventDefault();
        setButtonLoading(true);
        setEmailError(null);
        setPasswordError(null);

        // Check for validity of inputs
        let email: string = (document.querySelector("#email") as HTMLInputElement).value;
        let password: string = (document.querySelector("#password") as HTMLInputElement).value;
        let tfa: string = (document.querySelector("#tfa") as HTMLInputElement).value;

        if (!email) {
            setEmailError(props.lang.emailRequired);
            return setButtonLoading(false);
        }
        if (!password) {
            setPasswordError(props.lang.passwordRequired);
            return setButtonLoading(false);
        }
        if (!validator.isEmail(email)) {
            setEmailError(props.lang.emailInvalid);
            return setButtonLoading(false);
        }

        (async () => {
            try {
                // Send the request to the login api
                let response: any = await axios({
                    method: "POST",
                    url: `${props.host}/api/accounts/login`,
                    data: {
                        password: password,
                        email: email,
                        tfaCode: tfa,
                    },
                });

                // If the login was successful, redirect to the main window
                if (response.data.message == "success") return (window.location.href = "/home");

                // If the response was a "requires-tfa" show the tfa page
                if (response.data.message == "requires-tfa") {
                    setButtonLoading(false);
                    return setPageShowing("tfa-form");
                }

                // If not, reset inputs and show error
                if (response.data.message == "invalid-credentials") {
                    (document.querySelector("#password") as HTMLInputElement).value = "";

                    setButtonLoading(false);
                    return setEmailError(props.lang.emailOrPasswordIncorrect);
                }

                // If the tfa code is invalid
                if (response.data.message == "invalid-tfa-code") {
                    (document.querySelector("#tfa") as HTMLInputElement).value = "";

                    setButtonLoading(false);
                    return setTfaError(props.lang.invalidTfa);
                }

                // If the user exceeded the login rate
                if (response.data.message == "rate-limit-exceeded") {
                    (document.querySelector("#password") as HTMLInputElement).value = "";

                    setButtonLoading(false);
                    return setEmailError(props.lang.rateLimitExceeded);
                }

                return (window.location.href = `/error?code=${response.data.status}&message=${response.data.message}`);
            } catch (err: any) {
                return (window.location.href = `/error?code=${err.response.status}`);
            }
        })();
    };

    return (
        <div className={styles["page"]}>
            <Navbar lang={props.lang.navbar} user={null} />

            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            <Container hidden={pageShowing !== "login-form"} className={styles["login-form"]}>
                <h3>{props.lang.title}</h3>
                <br />

                <label htmlFor="email">{props.lang.email}</label>
                <input type="text" name="email" id="email" placeholder="john@example.com" />
                <p className={styles["error-label"]}>{emailError}</p>

                <br />

                <label htmlFor="password">{props.lang.password}</label>
                <input type="password" name="password" id="password" placeholder="••••••••" />
                <p className={styles["error-label"]}>{passwordError}</p>

                <br />
                <br />

                <Row xs="1" sm="1" md="2">
                    <Col>
                        <Button onClick={handleLogin} disabled={buttonLoading} type="submit">
                            <p hidden={buttonLoading}>{props.lang.login}</p>
                            <Spinner size="sm" hidden={!buttonLoading} animation="border" />
                        </Button>
                    </Col>
                    <Col className={`${styles["reset-password"]} align-middle`}>
                        <Link href="/accounts/reset">{props.lang.forgotPassword}</Link>
                    </Col>
                </Row>
                <br />
                <p>
                    {props.lang.doNotHaveAnAccount.split("&")[0]} <Link href="/register">{props.lang.doNotHaveAnAccount.split("&")[1]}</Link>
                </p>
            </Container>

            <Container hidden={pageShowing !== "tfa-form"} className={styles["tfa-form"]}>
                <h3>{props.lang.title}</h3>
                <br />

                <label htmlFor="tfa">
                    {props.lang.tfa}: {props.lang.tfaHelp}
                </label>
                <br />
                <input type="text" name="tfa" id="tfa" placeholder="••••••" />
                <sub className={styles["error-label"]}>{tfaError}</sub>

                <br />
                <br />

                <Button onClick={handleLogin} disabled={buttonLoading} type="submit">
                    <p hidden={buttonLoading}>{props.lang.submit}</p>
                    <Spinner size="sm" hidden={!buttonLoading} animation="border" />
                </Button>
            </Container>
        </div>
    );
};

export default Login;
