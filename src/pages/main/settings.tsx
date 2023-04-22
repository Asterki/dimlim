import React from "react";
import axios, { AxiosResponse } from "axios";
import { motion } from "framer-motion";

import { useRouter } from "next/router";
import Head from "next/head";
import * as Tabs from "@radix-ui/react-tabs";
import Dialog from "@/components/dialog";

import styles from "../../styles/main/settings.module.scss";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { GetServerSideProps, NextPage } from "next";
import { User } from "shared/types/models";

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

const Settings: NextPage<PageProps> = (props) => {
	const router = useRouter();
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.main.home;

	const [currentTab, setCurrentTab] = React.useState<string>("profile");

	// Account dialogs
	const [accountLogoutDialogOpen, setAccountLogoutDialogOpen] = React.useState(false);

	const accountActions = {
		logout: async () => {
			const response: AxiosResponse<"ok"> = await axios({
				url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/accounts/logout`,
				method: "POST",
			});

			if (response.data == "ok") return router.push("/");
		},
        changeEmail: async () => {
            // const response: Axioi
        }
	};

	return (
		<div className={styles["page"]}>
			<Head>
				<title>DIMLIM | Settings</title>
			</Head>

            {/* Account */}
			<Dialog dialogOpen={accountLogoutDialogOpen}>
				<h1>Logout</h1>
				<p>Do you want to log out?</p>
				<br />

				<button onClick={() => accountActions.logout()}>Logout</button>
				<br />
				<br />
				<button onClick={() => setAccountLogoutDialogOpen(false)}>Cancel</button>
			</Dialog>

			<main>
				<Tabs.Root value={currentTab} onValueChange={(tab) => setCurrentTab(tab)}>
					<Tabs.List className={styles["tab-triggers"]}>
						<Tabs.Trigger value="profile" className={`${styles["tab-trigger"]} ${currentTab == "profile" ? styles["tab-trigger-active"] : ""}`}>
							Profile
						</Tabs.Trigger>

						<Tabs.Trigger value="security" className={`${styles["tab-trigger"]} ${currentTab == "security" ? styles["tab-trigger-active"] : ""}`}>
							Security
						</Tabs.Trigger>

						<Tabs.Trigger value="messages" className={`${styles["tab-trigger"]} ${currentTab == "messages" ? styles["tab-trigger-active"] : ""}`}>
							Messages
						</Tabs.Trigger>

						<Tabs.Trigger value="account" className={`${styles["tab-trigger"]} ${currentTab == "account" ? styles["tab-trigger-active"] : ""}`}>
							Account
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="profile" className={styles["tab-content"]}>
						<br />
						<h1>Profile Overview</h1>
						<br />

						<div className={styles["profile-overview"]}>
							<img src={props.user.avatar !== "" ? props.user.avatar : "/assets/images/default-avatar.png"} alt="user avatar" />

							<br />

							<h3>{props.user.username}</h3>
							<p>{props.user.email.value}</p>

							<br />

							<p>User ID: {props.user.userID}</p>
							<p>Email verified: {props.user.email.verified ? "Yes" : "No"}</p>
							<p>TFA Active: {props.user.tfa.secret !== "" ? "Yes" : "No"}</p>
						</div>
					</Tabs.Content>

					<Tabs.Content value="security" className={styles["tab-content"]}>
						<br />
						<h1>Security Settings</h1>
						<br />

						<div className={styles["tab-action"]}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/settings-cog-check.svg" alt="settings-cog-check Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>{props.user.tfa.secret == "" ? "Activate TFA" : "Deactivate TFA"}</h3>
								<p>Add an extra layer of security using two factor authentication (TFA)</p>
							</div>
						</div>

						<div className={styles["tab-action"]}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/password.svg" alt="password Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>Change password</h3>
								<p>Change your current password</p>
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="messages" className={styles["tab-content"]}>
						<br />
						<h1>Messages Settings</h1>
						<br />

						<div className={styles["tab-action"]}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/user-box.svg" alt="user-box Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>See contacts</h3>
								<p>See the people you've added to your contacts</p>
							</div>
						</div>

						<div className={styles["tab-action"]}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/lock.svg" alt="lock Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>See blocked contacts</h3>
								<p>See the accounts that you've blocked</p>
							</div>
						</div>

						<div className={styles["tab-action"]}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/delete-bin.svg" alt="delete-bin Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>Delete all messages</h3>
								<p>Delete all messages stored on your device</p>
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="account" className={styles["tab-content"]}>
						<br />
						<h1>Account Settings</h1>
						<br />

						<div className={styles["tab-action"]}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/mail.svg" alt="mail Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>Change email</h3>
								<p>Change the email you log in with</p>
							</div>
						</div>

						<div className={styles["tab-action"]} onClick={() => setAccountLogoutDialogOpen(true)}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/logout.svg" alt="Logout Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>Logout</h3>
								<p>Logout of your account</p>
							</div>
						</div>

						<div className={styles["tab-action"]}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/delete-bin.svg" alt="delete icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>Delete account</h3>
								<p>Delete your DIMLIM account</p>
							</div>
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</main>
		</div>
	);
};

export default Settings;
