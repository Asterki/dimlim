import React from "react";
import axios, { AxiosResponse } from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import Head from "next/head";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Dialog from "@/components/dialog";

import styles from "../../styles/main/home.module.scss";
import { User } from "../../../shared/types/models";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { GetServerSideProps, NextPage } from "next";

import { AddContactRequestBody, AddContactResponse, GetInformationResponse } from "../../../shared/types/api/users";

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

	const [addContactDialogOpen, setAddContactDialogOpen] = React.useState(false);
	const [addContactDialogError, setAddContactDialogError] = React.useState("no-errors");
	const addContactUsernameInput = React.useRef<HTMLInputElement>(null);

	const [contactList, setContactList] = React.useState<Array<any>>([]);

	const contactListElement = contactList.map((user: { userID: string; username: string; avatar: string }) => {
		return (
			<div key={user.userID} className={styles["contact-card"]}>
				<div className={styles["contact-information"]}>
					<img
						src={
							user.avatar !== ""
								? `/avatars/${user.userID}/${user.avatar}.jpeg`
								: "/assets/images/default-avatar.png"
						}
						alt={`${user.username} avatar`}
					/>

					<h3>{user.username}</h3>
				</div>
			</div>
		);
	});

	const addContact = async () => {
		const response: AxiosResponse<AddContactResponse> = await axios({
			method: "POST",
			url: "/api/users/add-contact",
			data: {
				contactUsername: addContactUsernameInput.current!.value,
			} as AddContactRequestBody,
		});

        if (response.data == "done") return window.location.reload();
        return setAddContactDialogError(response.data)
	};

	React.useEffect(() => {
		(async () => {
			const response: AxiosResponse<GetInformationResponse> = await axios({
				method: "POST",
				url: "/api/users/get-information",
			});

			if (response.data !== "unauthorized") return setContactList(response.data);
			window.location.href = "/login";
		})();
	}, []);

	return (
		<div className={styles["page"]}>
			<Head>
				<title>{lang.pageTitle}</title>
			</Head>

			<Dialog dialogOpen={addContactDialogOpen}>
				<h1>{lang.addContactDialog.title}</h1>
				<label htmlFor="username-input">{lang.addContactDialog.description}</label>
				<input type="text" ref={addContactUsernameInput} id="username-input" />
				<br />

                <p className={styles["error"]}>{lang.addContactDialog.errors[addContactDialogError]}</p>

				<button
					onClick={() => {
						addContact();
					}}
				>
					{lang.addContactDialog.addContact}
				</button>
				<button
					onClick={() => {
						setAddContactDialogOpen(false);
					}}
				>
					{lang.addContactDialog.cancel}
				</button>
			</Dialog>

			<main>
				<div className={styles["navbar"]}>
					<div className={styles["branding"]}>
						<img src="/assets/svg/logo-no-background.svg" alt="logo" />
					</div>

					<DropdownMenu.Root onOpenChange={(state: boolean) => setNavbarOpen(state)}>
						<DropdownMenu.Trigger className={styles["navbar-trigger"]}>
							<div className={styles["contact-information"]}>
								<img
									src={
										props.user.avatar !== ""
											? `/avatars/${props.user.userID}/${props.user.avatar}.jpeg`
											: "/assets/images/default-avatar.png"
									}
									alt="user avatar"
								/>
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
								<DropdownMenu.Item className={styles["navbar-option"]}>
									{lang.profileMenu.addContact}
								</DropdownMenu.Item>
								<DropdownMenu.Item className={styles["navbar-option"]}>
									{lang.profileMenu.blockedContacts}
								</DropdownMenu.Item>
								<DropdownMenu.Item
									className={styles["navbar-option"]}
									onClick={() => router.push("/main/settings")}
								>
									{lang.profileMenu.settings}
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				</div>

				<button
					className={styles["add-contact-button"]}
					onClick={() => {
						setAddContactDialogOpen(true);
					}}
				>
					{lang.addContactDialog.addContact}
				</button>

				<div className={styles["contact-list"]}>
					<h1>Chats</h1>
					{contactListElement}
				</div>
			</main>
		</div>
	);
};

export default Home;
