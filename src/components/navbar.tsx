/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import * as React from "react";

import { Navbar, Nav, NavDropdown, Container, Dropdown } from "react-bootstrap";
import { NextPage } from "next";
import { Avatar } from "@mui/material";

import styles from "./navbar.module.scss";

const NavbarComponent = (props: { lang: any; user: any | null }) => {
    if (props.user == null) {
        return (
            <Navbar className={styles["component"]} sticky="top" collapseOnSelect variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>
                        <Navbar.Brand href="/">
                            <img alt="" src="/logo.svg" width="30" height="30" className="d-inline-block align-top" /> <b>DIMLIM</b>
                        </Navbar.Brand>
                    </Navbar.Brand>

                    <Navbar.Toggle />

                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <Nav.Link className={styles["link"]} href="/login">
                                {props.lang.login}
                            </Nav.Link>
                            <Nav.Link className={styles["link"]} href="/register">
                                {props.lang.register}
                            </Nav.Link>
                            <Nav.Link className={styles["link"]} href="/about">
                                {props.lang.about}
                            </Nav.Link>
                            <Nav.Link className={styles["link"]} href="/support">
                                {props.lang.support}
                            </Nav.Link>
                            <Nav.Link className={styles["link"]} href="/download">
                                {props.lang.download}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    } else {
        return (
            <Navbar className={styles["component"]} sticky="top" collapseOnSelect expand="lg">
                <Container>
                    <Navbar.Brand>
                        <Navbar.Brand href="/home">
                            <img alt="" src="/logo.svg" width="30" height="30" className="d-inline-block align-top" /> <b>DIMLIM</b>
                        </Navbar.Brand>
                    </Navbar.Brand>

                    <Nav>
                        <Dropdown>
                            <Dropdown.Toggle variant="none" className="shadow-none" id="dropdown-basic">
                                <Avatar src={props.user.avatar == "" ? "" : `/avatars/${props.user.avatar}`} sx={{ width: 30, height: 30 }}></Avatar>
                                <p>
                                    <b>{props.user.username}</b>
                                </p>
                            </Dropdown.Toggle>

                            <Dropdown.Menu variant="dark" className={`container ${styles.dropdown}`} align="end">
                                <Dropdown.Item href="/settings">{props.lang.settings}</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="/settings?logout=true" className={styles["logout"]}>
                                    {props.lang.logout}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
};

export default NavbarComponent;
