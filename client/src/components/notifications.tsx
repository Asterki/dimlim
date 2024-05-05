import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faInfoCircle, faWarning, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

interface ComponentProps {
    state: "showing" | "hidden";
    title: string;
    content: string;
    type: "error" | "success" | "info" | "warning";
}

const NotificationComponent: React.FC<ComponentProps> = (props) => {
    let icon = faWarning;

    if (props.type === "error") icon = faXmarkCircle;
    if (props.type === "success") icon = faCheckCircle;
    if (props.type === "info") icon = faInfoCircle;

    return (
        <div
            data-state={props.state}
            className="z-30 bg-blue-400 transition-all data-[state=hidden]:opacity-0 text-white rounded-md absolute bottom-4 left-4 shadow-md p-4 flex items-center gap-4"
        >
            <div>
                <FontAwesomeIcon icon={icon} className="text-3xl" />
            </div>
            <div className="flex items-start flex-col">
                <h1 className="text-xl font-bold">{props.title}</h1>
                <h1 className="">{props.content}</h1>
            </div>
        </div>
    );
};

export default NotificationComponent;
