import React from "react";

import styles from "./message.module.scss";

const MessageComponent = (props: { timestamp: string; sentByMe: boolean; content: any; type: "text" | "file" }) => {
    let date = new Date(props.timestamp);
    let hour = date.getHours();
    let minute = date.getMinutes().toString().length == 1 ? `0${date.getMinutes().toString()}` : date.getMinutes();

    return (
        <div className={styles["component"]}>
            <div className={props.sentByMe ? styles["by-me"] : styles["not-by-me"]}>
                <div className={styles["content"]}>
                    <p>{props.content}</p>
                    <p className={styles["timestamp"]}>{`${hour}:${minute}`}</p>
                </div>
            </div>
        </div>
    );
};

export default MessageComponent;
