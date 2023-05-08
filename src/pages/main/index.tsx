/* eslint-disable @next/next/no-img-element */
import React from "react";
import axios, { AxiosResponse } from "axios";

import Link from "next/link";
import Head from "next/head";

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
		<div className={styles["main-index-page"]}>
            <Head>
                <title>{lang.title}</title>
            </Head>

			<main>
				<div className={styles["header"]}>
					<h1>DIMLIM</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis voluptatum ea beatae, odit modi</p>

					<img src="/assets/svg/logo-no-background.svg" alt="Icon png" />
				</div>

				<div className={styles["features"]}>
					<div>
						<img src="/assets/svg/shield.svg" alt="Shield" />
						<h1>{lang.security}</h1>
						<p> {lang.securityDesc}</p>
					</div>

					<div>
						<img src="/assets/svg/lock.svg" alt="Privacy" />
						<h1>{lang.privacy}</h1>
						<p>
							{lang.privacyDesc.split("&")[0]}
							<a href="https://github.com/Asterki/dimlim">{lang.privacyDesc.split("&")[1]}</a>
							{lang.privacyDesc.split("&")[2]}
						</p>
					</div>

					<div>
						<img src="/assets/svg/airplane-flight.svg" alt="Velocity" />
						<h1>{lang.velocity}</h1>
						<p>{lang.velocityDesc}</p>
					</div>
				</div>

				<div className={styles["footer"]}>
					<Link href="/register">
						<button>{lang.navbar.register}</button>
					</Link>
					<br />
					<br />
					<Link href="/login">
						<button>{lang.navbar.login}</button>
					</Link>
				</div>
			</main>
		</div>
	);
};

export default IndexPage;
