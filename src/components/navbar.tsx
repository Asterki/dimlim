/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import * as React from "react";

import { NextPage } from "next";

import styles from "./navbar.module.scss";

const NavbarComponent = (props: { lang: any; user: any | null }) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	if (props.user == null) {
		return (
			<div className={styles["component"]}>
				<div className={styles["branding"]}>
					<a href="">
						<img alt="" src="/logo.svg" width="30" height="30" className="d-inline-block align-top" /> <b>DIMLIM</b>
					</a>
				</div>

                <div className={styles["links"]}>
                    <a href=""></a>
                    <a href=""></a>
                </div>
			</div>
		);
	} else {
		return (
			<div>
				<h1>jewoqi</h1>
			</div>
			// <Navbar className={styles["component"]} sticky="top" collapseOnSelect expand="lg">
			// 	<Container>
			// 		<Navbar.Brand>
			// 			<Navbar.Brand href="/home">
			// 				<img alt="" src="/logo.svg" width="30" height="30" className="d-inline-block align-top" /> <b>DIMLIM</b>
			// 			</Navbar.Brand>
			// 		</Navbar.Brand>

			// 		<Nav>
			// 			<Dropdown.Toggle onClick={handleClick} variant="none" className="shadow-none" id="dropdown-basic">
			// 				<Avatar src={props.user.avatar == "" ? "" : `/avatars/${props.user.avatar}`} sx={{ width: 30, height: 30 }}></Avatar>
			// 				<p>
			// 					<b>{props.user.username}</b>
			// 				</p>
			// 			</Dropdown.Toggle>

			// 			<Menu
			// 				id="basic-menu"
			// 				anchorEl={anchorEl}
			// 				onClose={handleClose}
			// 				anchorOrigin={{
			// 					vertical: "bottom",
			// 					horizontal: "right",
			// 				}}
			// 				transformOrigin={{
			// 					vertical: "top",
			// 					horizontal: "right",
			// 				}}
			// 				open={open}
			// 			>
			// 				<MenuItem
			// 					onClick={() => {
			// 						window.location.href = "/settings";
			// 					}}
			// 				>
			// 					{props.lang.settings}
			// 				</MenuItem>
			// 				<MenuItem
			// 					onClick={() => {
			// 						window.location.href = "/settings?logout=true";
			// 					}}
			// 					className={styles["logout"]}
			// 				>
			// 					{props.lang.logout}
			// 				</MenuItem>
			// 			</Menu>
			// 		</Nav>
			// 	</Container>
			// </Navbar>
		);
	}
};

export default NavbarComponent;
