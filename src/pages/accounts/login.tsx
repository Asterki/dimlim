import * as React from "react";
import axios, { AxiosResponse } from "axios";
import validator from "validator";

import { Row, Col, Button, Container, Spinner } from "react-bootstrap";
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

        // Finger printing only for redirect purposes, see line 122
        let isMobile =
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                context.req.headers["user-agent"].toLowerCase()
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                context.req.headers["user-agent"].toLowerCase().substr(0, 4)
            )
                ? "true"
                : "false";

        return {
            props: {
                lang: languageResponse.data.content,
                host: process.env.HOST,
                isMobile: isMobile,
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
                if (response.data.message == "success") return (window.location.href = props.isMobile == "true" ? "/mobile/home" : "/home");

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
            <Navbar lang={props.lang.navbar} loggedIn={false} user={null} />

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
                        <Button onClick={handleLogin} disabled={buttonLoading} variant="primary" type="submit">
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
                    {props.lang.doNotHaveAnAccount.split("&")[0]} <a href="/register">{props.lang.doNotHaveAnAccount.split("&")[1]}</a>
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

                <Button onClick={handleLogin} disabled={buttonLoading} variant="primary" type="submit">
                    <p hidden={buttonLoading}>{props.lang.submit}</p>
                    <Spinner size="sm" hidden={!buttonLoading} animation="border" />
                </Button>
            </Container>
        </div>
    );
};

export default Login;
