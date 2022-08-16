import * as React from "react";
import axios from "axios";

import { Row, Col, Button, Container } from "react-bootstrap";

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

    return {
        props: {
            a: "a",
        },
    };
};

const Login: NextPage = (props: any) => {
    return (
        <div className={styles["page"]}>
            <Container className={styles["login-form"]}>
                <h3>Login into dispatch</h3>
                <br />

                <label htmlFor="email">E-Mail</label>
                <input type="text" name="email" id="email" placeholder="john@example.com" />

                <br />
                <br />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" />

                <br />
                <br />
                <br />

                <Row xs="1" sm="1" md="2">
                    <Col>
                        <Button id="login-button" variant="primary" type="submit">
                            Login
                        </Button>
                    </Col>
                    <Col className={`${styles["forgot-password"]} align-middle`}>
                        <a href="/accounts/reset">Forgot Your Password?</a>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
