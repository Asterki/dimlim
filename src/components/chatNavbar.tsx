import * as React from "react";

import { ChevronLeft } from "@mui/icons-material";

import styles from "./chatNavbar.module.scss";
import { Avatar, IconButton } from "@mui/material";

const ChatNavarComponent = (props: any) => {
    return (
        <div className={styles["component"]}>
            <div className={styles["contact-info"]}>
                <IconButton onClick={props.return}>
                    <ChevronLeft />
                </IconButton>

                <Avatar className={styles["contact-avatar"]} src={`/avatars/${props.contactUserID}.png`} />
                <div className={styles["contact-general"]}>
                    <p className={styles["contact-username"]}>{props.contactUsername}</p>
                </div>
            </div>
        </div>
    );
};

export default ChatNavarComponent;
