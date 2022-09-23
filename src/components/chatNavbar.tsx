import * as React from "react";

import { ChevronLeft } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";

import styles from "./chatNavbar.module.scss";
import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material";

const ChatNavarComponent = (props: any) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={styles["component"]}>
            <div className={styles["contact-info"]}>
                <IconButton onClick={props.returnAction}>
                    <ChevronLeft />
                </IconButton>

                <Button onClick={props.infoAction}>
                    <Avatar className={styles["contact-avatar"]} src={`/avatars/${props.contactUserID}.png`} />
                    <div className={styles["contact-general"]}>
                        <p className={styles["contact-username"]}>{props.contactUsername}</p>
                    </div>
                </Button>

                <IconButton onClick={handleClick}>
                    <MenuIcon />
                </IconButton>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    open={open}
                >
                    <MenuItem
                        onClick={() => {
                            props.muteAction();
                            handleClose();
                        }}
                    >
                        Mute Chat
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            props.blockAction();
                            handleClose();
                        }}
                    >
                        Block
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            props.deleteAction();
                            handleClose();
                        }}
                    >
                        Delete Chat
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default ChatNavarComponent;
