import * as React from "react";
import axios from "axios";
import validator from "validator";

import { Row, Col, Button, Container, Spinner } from "react-bootstrap";
import Head from "next/head";

import styles from "../../styles/accounts/login.module.scss";
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
    const [buttonLoading, setButtonLoading] = React.useState(false);
    const [emailError, setEmailError] = React.useState<string | null>(null);
    const [passwordError, setPasswordError] = React.useState<string | null>(null);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setButtonLoading(true);

        setEmailError(null);
        setPasswordError(null);

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
                let response: any = await axios({
                    method: "POST",
                    url: `${props.host}/api/accounts/login`,
                    data: {
                        password: password,
                        email: email,
                    },
                });

                if (response.data == "success") return (window.location.href = "/home");

                if (response.data == "invalid-credentials") {
                    (document.querySelector("#password") as HTMLInputElement).value = "";

                    setButtonLoading(false);
                    return setEmailError(props.lang.emailOrPasswordIncorrect);
                }

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
                <br />

                <label htmlFor="password">{props.lang.password}</label>
                <input type="password" name="password" id="password" placeholder="••••••••" />
                <p className={styles["error-label"]}>{passwordError}</p>

                <br />
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
                    <Col className={`${styles["forgot-password"]} align-middle`}>
                        <a href="/accounts/reset">{props.lang.forgotPassword}</a>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
