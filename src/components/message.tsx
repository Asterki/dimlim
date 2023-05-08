import React from "react";

import styles from "./message.module.scss";
import { FileDownload } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const MessageComponent = (props: {
    timestamp: string;
    sentByMe: boolean;
    content: any;
    name: string | undefined;
    caption: string | undefined;
    type: "text" | "image" | "video" | "file";
}) => {
    let date = new Date(props.timestamp);
    let hour = date.getHours();
    let minute = date.getMinutes().toString().length == 1 ? `0${date.getMinutes().toString()}` : date.getMinutes();

    return (
        <div className={styles["component"]}>
            {props.type == "image" && (
                <div className={props.sentByMe ? styles["by-me"] : styles["not-by-me"]}>
                    <div className={styles["content"]}>
                        <img src={props.content} /> <br />
                        <p>{props.caption}</p>
                        <p className={styles["timestamp"]}>{`${hour}:${minute}`}</p>
                    </div>
                </div>
            )}
            {props.type == "video" && (
                <div className={props.sentByMe ? styles["by-me"] : styles["not-by-me"]}>
                    <div className={styles["content"]}>
                        <video controls src={props.content} /> <br />
                        <p>{props.caption}</p>
                        <p className={styles["timestamp"]}>{`${hour}:${minute}`}</p>
                    </div>
                </div>
            )}
            {props.type == "file" && (
                <div className={props.sentByMe ? styles["by-me"] : styles["not-by-me"]}>
                    <div className={styles["content"]}>
                        <a download={props.name} href={props.content} className={styles["file"]}>
                            {props.name}
                            <IconButton>
                                <FileDownload />
                            </IconButton>
                        </a>
                        <br />
                        <p>{props.caption}</p>
                        <p className={styles["timestamp"]}>{`${hour}:${minute}`}</p>
                    </div>
                </div>
            )}
            {props.type == "text" && (
                <div className={props.sentByMe ? styles["by-me"] : styles["not-by-me"]}>
                    <div className={styles["content"]}>
                        <p>{props.content}</p>
                        <p className={styles["timestamp"]}>{`${hour}:${minute}`}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageComponent;
