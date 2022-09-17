/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import axios, { AxiosResponse } from "axios";
import validator from "validator";

import Head from "next/head";
import Navbar from "../components/navbar";

import { Col, Container, Row } from "react-bootstrap";
import {
    Box,
    Tab,
    Button,
    Avatar,
    Badge,
    Dialog,
    DialogActions,
    DialogTitle,
    RadioGroup,
    Radio,
    FormControlLabel,
    DialogContent,
    List,
    ListItem,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AddAPhoto, Create, SecurityUpdateGood, Email, Logout, DeleteForever } from "@mui/icons-material";

import styles from "../styles/settings.module.scss";
import { GetServerSideProps, NextPage } from "next/types";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    if (!context.req.isAuthenticated())
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };

    try {
        let languageResponse: AxiosResponse = await axios({
            method: "post",
            url: `${process.env.HOST}/api/content/language/`,
            data: {
                lang: context.req.user.preferredLanguage == "" ? context.req.headers["accept-language"].split(",")[0] : context.req.user.preferredLanguage,
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
    const [activeTab, setActiveTab] = React.useState("1");

    // Profile picture
    const [avatarDialogOpen, setAvatarDialogOpen] = React.useState(false);
    const [avatarPreviewFile, setAvatarPreviewFile] = React.useState("");

    // Email
    const [emailDialogOpen, setEmailDialogOpen] = React.useState(false);
    const [emailDialogEmailError, setEmailDialogEmailError] = React.useState("");

    // Language
    const [languageDialogOpen, setLanguageDialogOpen] = React.useState(false);
    const [selectedLanguage, setSelectedLanguage] = React.useState(props.user.preferredLanguage);

    // Bio
    const [bioDialogOpen, setBioDialogOpen] = React.useState(false);

    // Password
    const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
    const [passwordDialogEmailError, setPasswordDialogEmailError] = React.useState("");

    // TFA
    const [setupTfaDialogOpen, setSetupTfaDialogOpen] = React.useState(false);
    const [activateTfaDialogOpen, setActivateTfaDialogOpen] = React.useState(false);
    const [tfaConfirmDialogOpen, setTfaConfirmDialogOpen] = React.useState(false);
    const [tfaBackupDialogOpen, setTfaBackupDialogOpen] = React.useState(false);

    const [tfaImage, setTfaImage] = React.useState("");
    const [tfaSecret, setTfaSecret] = React.useState("");
    const [tfaBackupCodes, setTfaBackupCodes] = React.useState([]);

    const [tfaDialogEmailError, setTfaDialogEmailError] = React.useState("");
    const [tfaBackupDialogEmailError, setTfaBackupDialogEmailError] = React.useState("");

    // Email
    const [verifyEmailDialogOpen, setVerifyEmailDialogOpen] = React.useState(false);
    const [verificationEmailSentDialogOpen, setVerificationEmailSentDialogOpen] = React.useState(false);

    // Logout
    const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

    // Delete account
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = React.useState(false);
    const [deleteAccountError, setDeleteAccountError] = React.useState("");

    const changeEmail = async (event: any) => {
        let password = (document.querySelector("#dialog-password") as HTMLInputElement).value;
        let email = (document.querySelector("#dialog-email") as HTMLInputElement).value;

        if (!email || !password) return setEmailDialogEmailError(props.lang.general.dialogs.email.missing);
        if (!validator.isEmail(email)) return setEmailDialogEmailError(props.lang.general.dialogs.email.invalidEmail);

        let response: AxiosResponse = await axios({
            method: "POST",
            url: `${props.host}/api/users/change-email`,
            data: {
                password: password,
                newEmail: email,
            },
        });

        if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);

        if (response.data.message == "success") {
            return window.location.reload();
        } else setEmailDialogEmailError(props.lang.general.dialogs.email[response.data.message]);
    };

    const changeLanguage = async (event: any) => {
        await axios({
            method: "POST",
            url: `${props.host}/api/users/set-language`,
            data: {
                newLanguage: selectedLanguage,
            },
        });

        setLanguageDialogOpen(false);
        return window.location.reload();
    };

    const changeBio = async (event: any) => {
        await axios({
            method: "POST",
            url: `${props.host}/api/users/set-bio`,
            data: {
                newBio: (document.querySelector("#dialog-bio-input") as HTMLInputElement).value,
            },
        });

        setBioDialogOpen(false);
        return window.location.reload();
    };

    const changePassword = async (event: any) => {
        let oldPass = (document.querySelector("#password-old-input") as HTMLInputElement).value;
        let newPass = (document.querySelector("#password-new-input") as HTMLInputElement).value;
        let tfaCode = "";

        if (!oldPass || !newPass) return setPasswordDialogEmailError(props.lang.security.dialogs.password["missing-parameters"]);
        if (newPass.length < 8 || newPass.length > 256) return setPasswordDialogEmailError(props.lang.security.dialogs.password["invalid-parameters"]);

        if (props.user.tfa.secret !== "") {
            tfaCode = (document.querySelector("#password-tfa-input") as HTMLInputElement).value;
            if (!tfaCode) return setPasswordDialogEmailError(props.lang.security.dialogs.password["missing-parameters"]);
        }

        let response = await axios({
            method: "POST",
            url: `${props.host}/api/users/change-password`,
            data: {
                oldPassword: oldPass,
                newPassword: newPass,
                tfaCode: tfaCode,
            },
        });

        if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);

        if (response.data.message == "success") {
            setPasswordDialogOpen(false);
            return window.location.reload();
        } else setPasswordDialogEmailError(props.lang.security.password[response.data.message]);
    };

    const activateTFA = async (event: any) => {
        let response: AxiosResponse = await axios({
            method: "post",
            url: `${props.host}/api/accounts/activate-tfa/`,
        });

        setTfaImage(response.data.image);
        setTfaSecret(response.data.code);

        setTfaConfirmDialogOpen(false);
        setActivateTfaDialogOpen(true);
    };

    const deactivateTFA = async (event: any) => {
        let tfaCode = (document.querySelector("#tfa-deactivate-code") as HTMLInputElement).value;
        if (!tfaCode) return setTfaDialogEmailError(props.lang.security.dialogs.setupTfa["missing-parameters"]);

        let response = await axios({
            method: "POST",
            url: `${props.host}/api/accounts/deactivate-tfa`,
            data: {
                tfaCode: tfaCode,
            },
        });

        if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);

        if (response.data.message == "success") {
            setSetupTfaDialogOpen(false);
            return window.location.reload();
        } else setTfaDialogEmailError(props.lang.security.dialogs.setupTfa[response.data.message]);
    };

    const getTFABackupCodes = async (event: any) => {
        let tfaCode = (document.querySelector("#dialog-backup-tfa-code-input") as HTMLInputElement).value;
        if (!tfaCode) return setTfaBackupDialogEmailError(props.lang.security.dialogs.backupTfa["missing-parameters"]);

        let response: AxiosResponse = await axios({
            method: "post",
            url: `${props.host}/api/accounts/verify-tfa/`,
            data: {
                code: tfaCode,
            },
        });

        if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);

        if (response.data.message == "success") {
            setTfaConfirmDialogOpen(false);
            setTfaBackupDialogOpen(true);

            setTfaBackupCodes(response.data.codes);
            setPasswordDialogEmailError("");
        } else setPasswordDialogEmailError(props.lang.security.password[response.data.message]);
    };

    const sendVerificationEmail = async (event: any) => {
        let response = await axios({
            method: "POST",
            url: `${props.host}/api/accounts/send-verification-email`,
            data: {
                lang: props.user.preferredLanguage,
            },
        });

        if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);
        setVerifyEmailDialogOpen(false);
        setVerificationEmailSentDialogOpen(true);
    };

    const deleteAccount = async (event: any) => {
        let password = (document.querySelector("#delete-account-password-input") as HTMLInputElement).value;
        let tfaCode = "";

        if (props.user.tfa.secret !== "") {
            tfaCode = (document.querySelector("#delete-account-tfa-input") as HTMLInputElement).value;
            if (!tfaCode) return setDeleteAccountError(props.lang.account.dialogs.deleteAccount["missing-parameters"]);
        }

        if (!password) return setDeleteAccountError(props.lang.account.dialogs.deleteAccount["missing-parameters"]);

        let response = await axios({
            method: "POST",
            url: `${props.host}/api/accounts/delete-account`,
            data: {
                tfaCode: tfaCode,
                password: password,
            },
        });

        console.log(response);

        if (response.data.code == 500) return (window.location.href = `/error?id=${response.data.id}`);

        if (response.data.message == "success") {
            return window.location.reload();
        } else setDeleteAccountError(props.lang.account.dialogs.deleteAccount[response.data.message]);
    };

    const codeList = tfaBackupCodes.map((code: any) => {
        return <ListItem key={code}>{code}</ListItem>;
    });

    return (
        <div className={styles["page"]}>
            <Navbar lang={props.lang.navbar} user={props.user} />
            <Head>
                <title>{props.lang.pageTitle}</title>
            </Head>

            {/* Avatar Dialog */}
            <Dialog open={avatarDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.general.dialogs.avatar.title}</DialogTitle>
                    <img width="200" src={avatarPreviewFile} alt="Avatar" />
                    <br />
                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setAvatarDialogOpen(false);
                                setAvatarPreviewFile("");
                            }}
                        >
                            {props.lang.general.dialogs.avatar.cancel}
                        </Button>
                        <Button
                            onClick={(event: any) => {
                                setAvatarDialogOpen(false);
                                setAvatarPreviewFile("");
                                (document.querySelector("#avatar-form") as HTMLFormElement).submit();
                            }}
                        >
                            {props.lang.general.dialogs.avatar.yes}
                        </Button>
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Email Dialog */}
            <Dialog open={emailDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.general.dialogs.email.title}</DialogTitle>
                    <p>{props.lang.general.dialogs.email.subTitle}</p>

                    <p className={styles["dialog-label"]}>
                        <b>{props.lang.general.dialogs.email.newEmail}</b>
                    </p>
                    <input id="dialog-email" type="text" placeholder="john@example.com" />

                    <br />
                    <br />

                    <p className={styles["dialog-label"]}>
                        <b>{props.lang.general.dialogs.email.password}</b>
                    </p>
                    <input id="dialog-password" type="password" placeholder="••••••••" />

                    <br />
                    <br />
                    <p className={styles["error"]}>{emailDialogEmailError}</p>

                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setEmailDialogOpen(false);
                                setEmailDialogEmailError("");
                            }}
                        >
                            {props.lang.general.dialogs.email.cancel}
                        </Button>
                        <Button onClick={changeEmail}>{props.lang.general.dialogs.email.yes}</Button>
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Language Dialog */}
            <Dialog open={languageDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.general.dialogs.language.title}</DialogTitle>
                    <p>{props.lang.general.dialogs.language.subTitle}</p>

                    <DialogContent dividers>
                        <RadioGroup
                            name="language"
                            onChange={(event: any) => {
                                setSelectedLanguage((event.target as HTMLInputElement).value);
                                switch ((event.target as HTMLInputElement).value) {
                                    case "English":
                                        setSelectedLanguage("en");
                                        break;
                                    case "Español":
                                        setSelectedLanguage("es");
                                        break;
                                    case "Français":
                                        setSelectedLanguage("fr");
                                        break;
                                    case "Português":
                                        setSelectedLanguage("pr");
                                        break;
                                    case "Deutsch":
                                        setSelectedLanguage("de");
                                        break;
                                }
                            }}
                            value={props.lang.general.locales[selectedLanguage]}
                        >
                            {["English", "Español", "Français", "Português", "Deutsch"].map((option) => (
                                <FormControlLabel value={option} key={option} control={<Radio />} label={option} />
                            ))}
                        </RadioGroup>
                    </DialogContent>

                    <br />
                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setSelectedLanguage(props.user.preferredLanguage);
                                setLanguageDialogOpen(false);
                            }}
                        >
                            {props.lang.general.dialogs.language.cancel}
                        </Button>
                        <Button onClick={changeLanguage}>{props.lang.general.dialogs.language.change}</Button>
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Bio Dialog */}
            <Dialog open={bioDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.general.dialogs.bio.title}</DialogTitle>
                    <input id="dialog-bio-input" type="text" defaultValue={props.user.bio} />
                    <br />

                    <br />
                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                (document.querySelector("#dialog-bio-input") as HTMLInputElement).value = "";
                                setBioDialogOpen(false);
                            }}
                        >
                            {props.lang.general.dialogs.bio.cancel}
                        </Button>
                        <Button onClick={changeBio}>{props.lang.general.dialogs.bio.change}</Button>
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Password Dialog */}
            <Dialog open={passwordDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.security.dialogs.password.title}</DialogTitle>
                    <p className={styles["dialog-label"]}>
                        <b>{props.lang.security.dialogs.password.old}</b>
                    </p>
                    <input id="password-old-input" type="password" placeholder="••••••••" />
                    <br />
                    <br />

                    <p className={styles["dialog-label"]}>
                        <b>{props.lang.security.dialogs.password.new}</b>
                    </p>
                    <input id="password-new-input" type="password" placeholder="••••••••" />
                    <br />
                    <br />

                    {props.user.tfa.secret !== "" && (
                        <>
                            <p className={styles["dialog-label"]}>
                                <b>{props.lang.security.dialogs.password.tfa}</b>
                            </p>
                            <input id="password-tfa-input" type="password" placeholder="••••••" />
                            <br />
                            <br />
                        </>
                    )}

                    <p className={styles["error"]}>{passwordDialogEmailError}</p>

                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setPasswordDialogOpen(false);
                                setPasswordDialogEmailError("");
                            }}
                        >
                            {props.lang.security.dialogs.password.cancel}
                        </Button>
                        <Button onClick={changePassword}>{props.lang.security.dialogs.password.change}</Button>
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Show First TFA Dialog */}
            <Dialog open={setupTfaDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.security.dialogs.setupTfa.title}</DialogTitle>

                    <p className={styles["dialog-label"]}>{props.lang.security.dialogs.setupTfa.subTitle}</p>
                    <br />

                    {props.user.email.verified == false && (
                        <>
                            <p>{props.lang.security.dialogs.setupTfa.emailVerified}</p>

                            <DialogActions>
                                <Button
                                    onClick={(event: any) => {
                                        setSetupTfaDialogOpen(false);
                                    }}
                                >
                                    {props.lang.security.dialogs.setupTfa.ok}
                                </Button>
                            </DialogActions>
                        </>
                    )}

                    {props.user.tfa.secret == "" && props.user.email.verified == true && (
                        <DialogActions>
                            <Button
                                onClick={(event: any) => {
                                    setSetupTfaDialogOpen(false);
                                }}
                            >
                                {props.lang.security.dialogs.setupTfa.cancel}
                            </Button>
                            <Button onClick={activateTFA}>{props.lang.security.dialogs.setupTfa.activate}</Button>
                        </DialogActions>
                    )}

                    {props.user.tfa.secret !== "" && props.user.email.verified == true && (
                        <>
                            <br />
                            <p className={styles["dialog-label"]}>
                                <b>{props.lang.security.dialogs.setupTfa.deactivateLabel}</b>
                            </p>
                            <input id="tfa-deactivate-code" type="password" placeholder="••••••" />
                            <p className={styles["error"]}>{tfaDialogEmailError}</p>

                            <DialogActions>
                                <Button
                                    onClick={(event: any) => {
                                        setSetupTfaDialogOpen(false);
                                        setTfaDialogEmailError("");
                                    }}
                                >
                                    {props.lang.security.dialogs.setupTfa.cancel}
                                </Button>
                                <Button onClick={deactivateTFA}>{props.lang.security.dialogs.setupTfa.deactivate}</Button>
                            </DialogActions>
                        </>
                    )}
                </Container>
            </Dialog>

            {/* Show Activation TFA Dialog */}
            <Dialog open={activateTfaDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.security.dialogs.activateTfa.title}</DialogTitle>

                    <img src={tfaImage} alt="tfa image" />
                    <p>{tfaSecret}</p>

                    <p className={styles["error"]}>{props.lang.security.dialogs.activateTfa.warning}</p>

                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setActivateTfaDialogOpen(false);
                                setTfaConfirmDialogOpen(true);
                            }}
                        >
                            {props.lang.security.dialogs.activateTfa.done}
                        </Button>
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Confirm TFA Dialog */}
            <Dialog open={tfaConfirmDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.security.dialogs.backupTfa.title}</DialogTitle>

                    <p className={styles["dialog-label"]}>{props.lang.security.dialogs.backupTfa.subTitle}</p>
                    <input id="dialog-backup-tfa-code-input" type="password" placeholder="••••••••" />

                    <p className={styles["error"]}>{tfaBackupDialogEmailError}</p>

                    <DialogActions>
                        <Button onClick={getTFABackupCodes}>{props.lang.security.dialogs.backupTfa.submit}</Button>
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Show Backup TFA Codes Dialog */}
            <Dialog open={tfaBackupDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.security.dialogs.backupTfa.title}</DialogTitle>
                    <p className={styles["dialog-label"]}>{props.lang.security.dialogs.backupTfa.warning}</p>

                    <List>{codeList}</List>

                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setTfaBackupDialogOpen(false);
                                return window.location.reload();
                            }}
                        >
                            {props.lang.security.dialogs.backupTfa.done}
                        </Button>
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Show Email Verification Dialog */}
            <Dialog open={verifyEmailDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.account.dialogs.verifyEmail.title}</DialogTitle>
                    <p>{props.lang.account.dialogs.verifyEmail.subTitle}</p>

                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setVerifyEmailDialogOpen(false);
                            }}
                        >
                            {props.lang.account.dialogs.verifyEmail.cancel}
                        </Button>
                        {props.user.email.verified == false && <Button onClick={sendVerificationEmail}>{props.lang.account.dialogs.verifyEmail.verify}</Button>}
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Show Verification Email Sent Dialog */}
            <Dialog open={verificationEmailSentDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.account.dialogs.verificationEmailSent.title}</DialogTitle>
                    <p>
                        {props.lang.account.dialogs.verificationEmailSent.subTitle.split("&")[0] +
                            props.user.email.value +
                            props.lang.account.dialogs.verificationEmailSent.subTitle.split("&")[1]}
                    </p>

                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setVerificationEmailSentDialogOpen(false);
                            }}
                        >
                            {props.lang.account.dialogs.verificationEmailSent.ok}
                        </Button>
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Logout */}
            <Dialog open={logoutDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.account.dialogs.logout.title}</DialogTitle>
                    <p>{props.lang.account.dialogs.logout.warning}</p>

                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setLogoutDialogOpen(false);
                            }}
                        >
                            {props.lang.account.dialogs.logout.cancel}
                        </Button>
                        <Button
                            onClick={(event: any) => {
                                setLogoutDialogOpen(false);
                                window.location.href = "/api/accounts/logout";
                            }}
                        >
                            {props.lang.account.dialogs.logout.title}
                        </Button>
                    </DialogActions>
                </Container>
            </Dialog>

            {/* Delete Account */}
            <Dialog open={deleteAccountDialogOpen} className={styles["dialog-container"]} sx={{ backgroundColor: "none" }}>
                <Container fluid className={styles["dialog"]}>
                    <DialogTitle>{props.lang.account.dialogs.deleteAccount.title}</DialogTitle>
                    <p>{props.lang.account.dialogs.deleteAccount.warning}</p>

                    <p className={styles["dialog-label"]}>
                        <b>{props.lang.account.dialogs.deleteAccount.password}</b>
                    </p>
                    <input id="delete-account-password-input" type="password" placeholder="••••••••" />
                    <br />
                    <br />

                    {props.user.tfa.secret !== "" && (
                        <>
                            <p className={styles["dialog-label"]}>
                                <b>{props.lang.account.dialogs.deleteAccount.tfaCode}</b>
                            </p>
                            <input id="delete-account-tfa-input" type="password" placeholder="••••••" />
                            <br />
                            <br />
                        </>
                    )}

                    <p className={styles["error"]}>{deleteAccountError}</p>

                    <DialogActions>
                        <Button
                            onClick={(event: any) => {
                                setDeleteAccountDialogOpen(false);
                            }}
                        >
                            {props.lang.account.dialogs.logout.cancel}
                        </Button>
                        <Button onClick={deleteAccount}>{props.lang.account.dialogs.deleteAccount.title}</Button>
                    </DialogActions>
                </Container>
            </Dialog>

            <Container className={styles["categories"]}>
                <Box>
                    <TabContext value={activeTab}>
                        <Box sx={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", borderColor: "divider", padding: 0, margin: 0 }}>
                            <TabList
                                scrollButtons={true}
                                allowScrollButtonsMobile={true}
                                variant="fullWidth"
                                onChange={(event: any, tab: any) => {
                                    setActiveTab(tab);
                                }}
                            >
                                <Tab className={styles["tab"]} label={props.lang.tabs.general} value="1" />
                                <Tab className={styles["tab"]} label={props.lang.tabs.security} value="2" />
                                <Tab className={styles["tab"]} label={props.lang.tabs.account} value="3" />
                            </TabList>
                        </Box>

                        {/* General Configuration */}
                        <TabPanel value="1">
                            <h2>{props.lang.general.title}</h2>
                            <br />
                            <Badge
                                className={styles["avatar"]}
                                overlap="circular"
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                badgeContent={
                                    <AddAPhoto
                                        className={styles["add-picture"]}
                                        onClick={(e: any) => {
                                            (document.querySelector("#avatar-input") as HTMLInputElement).click();
                                        }}
                                    />
                                }
                            >
                                <Avatar
                                    src={props.user.avatar == "" ? "" : `/avatars/${props.user.avatar}`}
                                    sx={{ width: 200, height: 200, textAlign: "center" }}
                                />
                            </Badge>
                            <br />
                            <br />
                            <br />
                            <Container fluid className={styles["actions"]}>
                                <Container fluid className={styles["action"]}>
                                    <p className={styles["action-title"]}>{props.lang.general.username}</p>
                                    <Row>
                                        <Col>
                                            <h3>{props.user.username}</h3>
                                        </Col>
                                        <Col className={styles["action-icon"]}></Col>
                                    </Row>
                                </Container>
                                <br />
                                <Container
                                    fluid
                                    className={styles["action"]}
                                    onClick={(e: any) => {
                                        setBioDialogOpen(true);
                                    }}
                                >
                                    <p className={styles["action-title"]}>{props.lang.general.bio}</p>
                                    <Row>
                                        <Col>
                                            <h6>{props.user.bio == "" ? "None" : props.user.bio}</h6>
                                        </Col>
                                        <Col className={styles["action-icon"]}>
                                            <Create />
                                        </Col>
                                    </Row>
                                </Container>
                                <br />
                                <Container fluid className={styles["action"]}>
                                    <p className={styles["action-title"]}>{props.lang.general.email}</p>
                                    <Row>
                                        <Col>
                                            <h3>{props.user.email.value}</h3>
                                        </Col>
                                        <Col className={styles["action-icon"]}>
                                            <Create
                                                onClick={(e: any) => {
                                                    setEmailDialogOpen(true);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Container>
                                <br />
                                <Container
                                    fluid
                                    className={styles["action"]}
                                    onClick={(e: any) => {
                                        setLanguageDialogOpen(true);
                                    }}
                                >
                                    <p className={styles["action-title"]}>{props.lang.general.preferredLanguage}</p>
                                    <Row>
                                        <Col>
                                            <h3>{props.lang.general.locales[props.user.preferredLanguage]}</h3>
                                        </Col>
                                        <Col className={styles["action-icon"]}>
                                            <Create />
                                        </Col>
                                    </Row>
                                </Container>
                            </Container>
                            <br />
                            <br />
                            <b>{props.lang.general.contacts}</b> {props.user.contacts.length} <br />
                            <br />
                            <b>{props.lang.general.blockedContacts}</b> {props.user.blockedContacts.length} <br />
                            <br />
                            <b>{props.lang.general.creation}</b> {new Date(props.user.created).toString()} <br />
                            <br />
                            <br />
                        </TabPanel>

                        {/* Security Configuration */}
                        <TabPanel value="2">
                            <Container fluid className={styles["actions"]}>
                                <br />
                                <Container fluid className={styles["action"]}>
                                    <p className={styles["action-title"]}>{props.lang.security.password}</p>
                                    <Row>
                                        <Col>
                                            <h3>••••••••</h3>
                                        </Col>
                                        <Col className={styles["action-icon"]}>
                                            <Create
                                                onClick={(e: any) => {
                                                    setPasswordDialogOpen(true);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Container>
                                <br />
                                <Container
                                    fluid
                                    className={styles["action"]}
                                    onClick={(e: any) => {
                                        setSetupTfaDialogOpen(true);
                                    }}
                                >
                                    <p className={styles["action-title"]}>{props.lang.security.tfa}</p>
                                    <Row>
                                        <Col>
                                            <h3>{props.user.tfa.secret == "" ? props.lang.security.tfaNotActive : props.lang.security.tfaActive}</h3>
                                        </Col>
                                        <Col className={styles["action-icon"]}>
                                            <SecurityUpdateGood />
                                        </Col>
                                    </Row>
                                </Container>
                            </Container>
                        </TabPanel>

                        <TabPanel value="3">
                            <Container fluid className={styles["actions"]}>
                                <br />
                                <Container
                                    fluid
                                    className={styles["action"]}
                                    onClick={(e: any) => {
                                        setVerifyEmailDialogOpen(true);
                                    }}
                                >
                                    <p className={styles["action-title"]}>{props.lang.account.emailStatus}</p>
                                    <Row>
                                        <Col>
                                            <h3>
                                                {props.user.email.verified == true ? props.lang.account.emailVerified : props.lang.account.emailNotVerified}
                                            </h3>
                                        </Col>
                                        <Col className={styles["action-icon"]}>
                                            <Email />
                                        </Col>
                                    </Row>
                                </Container>
                                <br />
                                <Container
                                    fluid
                                    className={styles["action"]}
                                    onClick={(e: any) => {
                                        setLogoutDialogOpen(true);
                                    }}
                                >
                                    <p className={styles["action-title"]}>{props.lang.account.logout}</p>
                                    <Row>
                                        <Col>
                                            <h6>{props.lang.account.logoutDesc}</h6>
                                        </Col>
                                        <Col className={styles["action-icon"]}>
                                            <Logout />
                                        </Col>
                                    </Row>
                                </Container>
                                <br />
                                <Container
                                    fluid
                                    className={styles["action"]}
                                    onClick={(e: any) => {
                                        setDeleteAccountDialogOpen(true);
                                    }}
                                >
                                    <p className={styles["action-title"]}>{props.lang.account.deleteAccount}</p>
                                    <Row>
                                        <Col>
                                            <h6>{props.lang.account.deleteAccount}</h6>
                                        </Col>
                                        <Col className={styles["action-icon"]}>
                                            <DeleteForever />
                                        </Col>
                                    </Row>
                                </Container>
                            </Container>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Container>

            {/* Form over here because Idk where to put it */}
            <form hidden id="avatar-form" action="/api/upload/avatar" encType="multipart/form-data" method="POST">
                <input
                    onChange={(event: any) => {
                        let file = (document.querySelector("#avatar-input") as any).files[0];
                        let reader = new FileReader();

                        reader.onloadend = () => {
                            setAvatarPreviewFile(reader.result as string);
                        };

                        if (file) {
                            setAvatarDialogOpen(true);
                            reader.readAsDataURL(file);
                        } else {
                            setAvatarDialogOpen(false);
                            setAvatarPreviewFile("");
                        }
                    }}
                    id="avatar-input"
                    accept=".jpg, .png, .jpeg"
                    name="avatar"
                    type="file"
                />
            </form>
        </div>
    );
};

export default Settings;
