import * as React from "react";
import axios from "axios";
import validator from "validator";

import { Row, Col, Button, Container, Spinner } from "react-bootstrap";
import Head from "next/head";
import Navbar from "../../components/navbar";

import styles from "../../styles/accounts/login.module.scss";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    // If the user is already logged in, it will redirect to the main page instead
    if (context.req.user !== undefined)
        return {
            redirect: {
                destination: "/home",
                permanent: false,
            },
        };

    try {
        // Get the language pack
        let languageResponse: any = await axios({
            method: "get",
            url: `${process.env.HOST}/api/content/language/`,
            params: {
                lang: context.req.headers["accept-language"].split(",")[0],
                category: "accounts",
                page: "login",
            },
        });

        return {
            props: {
                lang: languageResponse.data,
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

    const handleLogin = async (e: any) => {
        // Reset errors, and set the button to load
        e.preventDefault();
        setButtonLoading(true);
        setEmailError(null);
        setPasswordError(null);

        // Check for validity of inputs
        let email: string = (document.querySelector("#email") as HTMLInputElement).value;
        let password: string = (document.querySelector("#password") as HTMLInputElement).value;

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
                    },
                });

                // If the login was successful, redirect to the main window 
                if (response.data == "success") return (window.location.href = "/home");

                // If not, reset inputs and show error
                if (response.data == "invalid-credentials") {
                    (document.querySelector("#password") as HTMLInputElement).value = "";

                    setButtonLoading(false);
                    return setEmailError(props.lang.emailOrPasswordIncorrect);
                }

                // If the user exceeded the login rate
                if (response.data == "rate-limit-exceeded") {
                    (document.querySelector("#password") as HTMLInputElement).value = "";

                    setButtonLoading(false);
                    return setEmailError(props.lang.rateLimitExceeded);
                }
            } catch (err: any) {
                return (window.location.href = `/error?code=${err.response.status}`);
            }
        })();
    };

    return (
        <div className={styles["page"]}>
            <Navbar lang={props.lang.navbar} loggedIn={false} user={null} />

            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            <Container className={styles["login-form"]}>
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
                        <Button
                            onClick={handleLogin}
                            disabled={buttonLoading}
                            id="login-button"
                            variant="primary"
                            type="submit"
                        >
                            <p hidden={buttonLoading}>{props.lang.login}</p>
                            <Spinner size="sm" hidden={!buttonLoading} animation="border" />
                        </Button>
                    </Col>
                    <Col className={`${styles["reset-password"]} align-middle`}>
                        <a href="/accounts/reset">{props.lang.forgotPassword}</a>
                    </Col>
                </Row>
                <br />
                <p>
                    {props.lang.doNotHaveAnAccount.split("&")[0]}{" "}
                    <a href="/register">{props.lang.doNotHaveAnAccount.split("&")[1]}</a>
                </p>
            </Container>
        </div>
    );
};

export default Login;
