import * as React from "react";
import axios, { AxiosResponse } from "axios";
import validator from "validator";

import { Row, Col, Spinner } from "react-bootstrap";
import { Container, Button, Link } from "@mui/material";

import Head from "next/head";
import Navbar from "../../components/navbar";

import styles from "../../styles/accounts/register.module.scss";
import { GetServerSideProps, NextPage } from "next";

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
                category: "accounts",
                page: "register",
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
                langCode: context.req.headers["accept-language"].split(",")[0],
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

const Register: NextPage = (props: any) => {
    const [buttonLoading, setButtonLoading] = React.useState(false);
    const [emailError, setEmailError] = React.useState<string | null>(null);
    const [usernameError, setUsernameError] = React.useState<string | null>(null);
    const [passwordError, setPasswordError] = React.useState<string | null>(null);

    const handleRegister = (e: any) => {
        e.preventDefault();
        setButtonLoading(true);

        setEmailError(null);
        setUsernameError(null);
        setPasswordError(null);

        let email: string = (document.querySelector("#email") as HTMLInputElement).value;
        let username: string = (document.querySelector("#username") as HTMLInputElement).value;
        let password: string = (document.querySelector("#password") as HTMLInputElement).value;
        let confirmPassword: string = (document.querySelector("#confirm-password") as HTMLInputElement).value;

        // Check if inputs are filled in
        if (!email) {
            setEmailError(props.lang.emailRequired);
            return setButtonLoading(false);
        }
        if (!username) {
            setUsernameError(props.lang.emailRequired);
            return setButtonLoading(false);
        }

        if (!password) {
            setPasswordError(props.lang.passwordRequired);
            return setButtonLoading(false);
        }
        if (!confirmPassword) {
            setPasswordError(props.lang.confirmPasswordRequired);
            return setButtonLoading(false);
        }

        // Validate each input
        if (!validator.isEmail(email)) {
            setEmailError(props.lang.emailInvalid);
            return setButtonLoading(false);
        }

        if (!validator.isAlphanumeric(username, "en-US", { ignore: "." })) {
            setUsernameError(props.lang.usernameInvalid);
            return setButtonLoading(false);
        }

        if (username.length < 3 || username.length > 32) {
            setUsernameError(props.lang.usernameLength);
            return setButtonLoading(false);
        }

        if (password.length < 3 || password.length > 64) {
            setPasswordError(props.lang.passwordLength);
            return setButtonLoading(false);
        }

        (async () => {
            try {
                let testResults: AxiosResponse = await axios({
                    method: "POST",
                    url: `${props.host}/api/accounts/check-use`,
                    data: {
                        email: email,
                        username: username,
                    },
                });

                if (testResults.data.message == "all-good") {
                    let response: AxiosResponse = await axios({
                        method: "POST",
                        url: `${props.host}/api/accounts/register`,
                        data: {
                            email: email,
                            username: username,
                            password: password,
                            lang: props.langCode,
                        },
                    });

                    switch (response.data.message) {
                        case "success":
                            window.location.href = "/home";
                            break;

                        case "try-again":
                            let newResponse = await axios({
                                method: "POST",
                                url: `${props.host}/api/accounts/register`,
                                data: {
                                    email: email,
                                    username: username,
                                    password: password,
                                    lang: props.langCode,
                                },
                            });

                            if (newResponse.data.message == "success") return (window.location.href = "/home");
                            break;

                        case "rate-limit-exceeded":
                            (document.querySelector("#password") as HTMLInputElement).value = "";

                            setButtonLoading(false);
                            setEmailError(props.lang.rateLimitExceeded);
                            break;

                        default:
                            window.location.href = `/error?code=${response.data.status}&message=${response.data.message}`;
                            break;
                    }
                } else {
                    if (testResults.data.message == "email-already-in-use") {
                        (document.querySelector("#email") as HTMLInputElement).value = "";
                        setButtonLoading(false);
                        return setEmailError(props.lang.emailInUse);
                    }

                    if (testResults.data.message == "username-already-in-use") {
                        (document.querySelector("#username") as HTMLInputElement).value = "";
                        setButtonLoading(false);
                        return setUsernameError(props.lang.usernameInUse);
                    }

                    return (window.location.href = `/error?code=${testResults.data.status}&message=${testResults.data.message}`);
                }
            } catch (err: any) {
                return (window.location.href = `/error?code=${err.response.status}`);
            }
        })();
    };

    return (
        <div>
            <div className={styles["page"]}>
                <Navbar lang={props.lang.navbar} user={null} />

                <Head>
                    <title>{props.lang.pageTitle}</title>
                </Head>

                <Container className={styles["register-form"]}>
                    <h3>{props.lang.title}</h3>
                    <br />

                    <label htmlFor="email">{props.lang.email}</label>
                    <input type="text" name="email" id="email" placeholder="john@example.com" />
                    <p className={styles["error-label"]}>{emailError}</p>

                    <br />

                    <label htmlFor="username">{props.lang.username}</label>
                    <input type="text" name="username" id="username" placeholder="john" />
                    <p className={styles["error-label"]}>{usernameError}</p>

                    <br />

                    <label htmlFor="password">{props.lang.password}</label>
                    <input type="password" name="password" id="password" placeholder="••••••••" />
                    <p className={styles["error-label"]}>{passwordError}</p>

                    <br />

                    <label htmlFor="confirm-password">{props.lang.confirmPassword}</label>
                    <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" />

                    <br />
                    <br />
                    <br />

                    <Row xs="1" sm="1" md="2">
                        <Col>
                            <Button onClick={handleRegister} disabled={buttonLoading} type="submit">
                                <p hidden={buttonLoading}>{props.lang.register}</p>
                                <Spinner size="sm" hidden={!buttonLoading} animation="border" />
                            </Button>
                        </Col>
                        <Col className={`${styles["already-a-user"]} align-middle`}>
                            <p>
                                {props.lang.alreadyHaveAnAccount.split("&")[0]} <Link href="/login">{props.lang.alreadyHaveAnAccount.split("&")[1]}</Link>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Register;
