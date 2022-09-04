import * as React from "react";
import axios from "axios";
import validator from "validator";

import { Row, Col, Button, Container, Spinner } from "react-bootstrap";
import Head from "next/head";
import Navbar from "../../components/navbar";

import styles from "../../styles/accounts/register.module.scss";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    if (context.req.user !== undefined)
        return {
            redirect: {
                destination: "/home",
                permanent: false,
            },
        };

    try {
        let languageResponse: any = await axios({
            method: "get",
            url: `${process.env.HOST}/api/content/language/`,
            params: {
                lang: context.req.headers["accept-language"].split(",")[0],
                category: "accounts",
                page: "register",
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
                let testResults: any = await axios({
                    method: "POST",
                    url: `${props.host}/api/accounts/test-fields`,
                    data: {
                        email: email,
                        username: username,
                    },
                });

                if (testResults.data == "success") {
                    let response: any = await axios({
                        method: "POST",
                        url: `${props.host}/api/accounts/register`,
                        data: {
                            email: email,
                            username: username,
                            password: password,
                        },
                    });

                    if (response.data == "success") return (window.location.href = "/home");

                    if (response.data == "rate-limit-exceeded") {
                        (document.querySelector("#password") as HTMLInputElement).value = "";

                        setButtonLoading(false);
                        return setEmailError(props.lang.rateLimitExceeded);
                    }
                } else {
                    if (testResults.data == "email-already-in-use") {
                        (document.querySelector("#email") as HTMLInputElement).value = "";
                        setButtonLoading(false);
                        return setEmailError(props.lang.emailInUse);
                    }

                    if (testResults.data == "username-already-in-use") {
                        (document.querySelector("#username") as HTMLInputElement).value = "";
                        setButtonLoading(false);
                        return setUsernameError(props.lang.usernameInUse);
                    }
                }
            } catch (err: any) {
                return (window.location.href = `/error?code=${err.response.status}`);
            }
        })();
    };

    return (
        <div>
            <div className={styles["page"]}>
                <Navbar lang={props.lang.navbar} loggedIn={false} user={null} />

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
                            <Button
                                onClick={handleRegister}
                                disabled={buttonLoading}
                                id="login-button"
                                variant="primary"
                                type="submit"
                            >
                                <p hidden={buttonLoading}>{props.lang.register}</p>
                                <Spinner size="sm" hidden={!buttonLoading} animation="border" />
                            </Button>
                        </Col>
                        <Col className={`${styles["already-a-user"]} align-middle`}>
                            <p>
                                {props.lang.alreadyHaveAnAccount.split("&")[0]}{" "}
                                <a href="/login">{props.lang.alreadyHaveAnAccount.split("&")[1]}</a>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Register;
