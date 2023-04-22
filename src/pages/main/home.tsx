import React from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { useRouter } from "next/router";
import Head from "next/head";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import styles from "../../styles/main/home.module.scss";
import { User } from "shared/types/models";

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

interface PageProps {
	user: User;
}

const Home: NextPage<PageProps> = (props) => {
	const router = useRouter();
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.main.home;

	const [navbarOpen, setNavbarOpen] = React.useState(false);

	const logout = async () => {
		const response = await axios.post("/api/accounts/logout");
		if (response.data == "ok") return (window.location.href = "/");
	};

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
					<div className={styles["branding"]}>
						<img src="/assets/svg/logo-no-background.svg" alt="logo" />
					</div>

					<DropdownMenu.Root onOpenChange={(state: boolean) => setNavbarOpen(state)}>
						<DropdownMenu.Trigger className={styles["navbar-trigger"]}>
							<div className={styles["contact-information"]}>
								<img src={props.user.avatar !== "" ? props.user.avatar : "/assets/images/default-avatar.png"} alt="user avatar" />
								<p>{props.user.username}</p>
							</div>

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
						</DropdownMenu.Trigger>
						<DropdownMenu.Portal>
							<DropdownMenu.Content align="end" className={styles["navbar-options"]}>
								<DropdownMenu.Item className={styles["navbar-option"]}>Add Contact</DropdownMenu.Item>
								<DropdownMenu.Item className={styles["navbar-option"]}>Blocked Contacts</DropdownMenu.Item>
								<DropdownMenu.Item className={styles["navbar-option"]} onClick={() => router.push("/main/settings")}>
									Settings
								</DropdownMenu.Item>
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
