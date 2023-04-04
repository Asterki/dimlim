/* eslint-disable @next/next/no-img-element */
import React from "react";
import axios, { AxiosResponse } from "axios";

import Navbar from "../../components/navbar";

import { GetServerSideProps, NextPage } from "next";
import styles from "../../styles/main/index.module.scss";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.isAuthenticated())
		return {
			redirect: {
				destination: "/home",
				permanent: false,
			},
		};

	return {
		props: {},
	};
};

const IndexPage: NextPage = (props: any) => {
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.main.welcome;

	return (
		<div className={styles["page"]}>
			<Navbar lang={lang.navbar} user={null} />

			<div className={styles["content"]}>
				<div className={styles["header"]}>
					<br />
					<h1>DIMLIM</h1>
					<br />

					<img src="/icon.png" alt="Icon png" />
				</div>

				<br />
				<br />
				<br />

				<div className={styles["main-content"]}>
					<img src="../../assets/images/shield-line.png" alt="Shield" />
					<h1>{lang.security}</h1>
					<p> {lang.securityDesc}</p>

					<br />
					<br />

					<img src="../../assets/images/user-box-line.png" alt="Privacy" />
					<h1>{lang.privacy}</h1>
					<p>
						{lang.privacyDesc.split("&")[0]}
						<a href="https://github.com/Asterki/dimlim">{lang.privacyDesc.split("&")[1]}</a>
						{lang.privacyDesc.split("&")[2]}
					</p>

					<br />
					<br />

					<img src="../../assets/images/airplane-flight-2-line.png" alt="Velocity" />
					<h1>{lang.velocity}</h1>
					<p>{lang.velocityDesc}</p>
				</div>

				<br />
				<br />
				<br />

				<div className={styles["footer"]}>
					<a href="/register">
						<button>{lang.navbar.register}</button>
					</a>
					<br />
					<br />
					<a href="/login">
						<button>{lang.navbar.login}</button>
					</a>

					<br />
					<br />
					<br />
					<p>Copyright© 2022 DIMLIM Team</p>
				</div>
			</div>
		</div>
	);
};

export default IndexPage;
