/* eslint-disable @next/next/no-img-element */
import React from "react";
import { motion } from "framer-motion";

import Head from "next/head";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import styles from "../../styles/main/home.module.scss";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (!context.req.isAuthenticated())
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};

	return {
		props: {
			user: JSON.parse(JSON.stringify(context.req.user)),
		},
	};
};

const Home: NextPage = (props: any) => {
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.main.home;

	const [navbarOpen, setNavbarOpen] = React.useState(false);

	const contactList = props.user.contacts.map((user: { userID: string; username: string }) => {
		return (
			<div key={user.userID} className={styles["contact-card"]}>
				<div className={styles["contact-information"]}>
					<object data="/assets/images/default-avatar.png" type="image/png">
						<img src={`/avatars/${user.userID}.png`} alt="Stack Overflow logo and icons and such" />
					</object>

					<h3>{user.username}</h3>
				</div>
			</div>
		);
	});

	return (
		<div className={styles["page"]}>
			<Head>
				<title>{lang.pageTitle}</title>
			</Head>

			<main>
				<div className={styles["navbar"]}>
					<h2>DIMLIM</h2>

					<DropdownMenu.Root onOpenChange={(state: boolean) => setNavbarOpen(state)}>
						<DropdownMenu.Trigger className={styles["navbar-trigger"]}>
							<motion.img
								variants={{
									open: {
										rotate: "180deg",
									},
									closed: {
										rotate: "0deg",
									},
								}}
								initial={"closed"}
								animate={navbarOpen ? "open" : "closed"}
								src="/assets/svg/chevron-down.svg"
								alt="down"
							/>

							<div className={styles["contact-information"]}>
								<h4>{props.user.username}</h4>
								<img src={props.user.avatar !== "" ? props.user.avatar : "/assets/images/default-avatar.png"} alt="Wa" />
							</div>
						</DropdownMenu.Trigger>
						<DropdownMenu.Portal>
							<DropdownMenu.Content align="end" className={styles["navbar-options"]}>
								<DropdownMenu.Item className={styles["navbar-option"]}>Settings</DropdownMenu.Item>

								<hr />

								<DropdownMenu.Item className={`${styles["navbar-option"]} ${styles["logout-option"]}`}>Logout</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				</div>

				<div className={styles["contact-list"]}>
					<h1>Chats</h1>
					{contactList}
				</div>
			</main>
		</div>
	);
};

export default Home;
