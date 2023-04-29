import * as React from "react";

import Head from "next/head";
import Link from "next/link";

import styles from "../../styles/accounts/verify-email.module.scss";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { GetServerSideProps, NextPage } from "next";
import { User } from "shared/types/models";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (!context.req.query.success && !context.req.query.error)
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};

	// Check the error messages
	if (context.req.query.success == false && context.req.query.error) {
		if (context.req.query.error == "invalid-code" || context.req.query.error == "expired")
			return {
				redirect: {
					destination: "/",
					permanent: false,
				},
			};
	}

	return {
		props: {
			user: context.req.isAuthenticated() ? JSON.parse(JSON.stringify(context.req.user)) : null,
			success: context.req.query.success == "true",
			error: context.req.query.error !== undefined ? context.req.query.error : null,
		},
	};
};

interface PageProps {
	user: User | null;
	success: boolean;
	error: "invalid-code" | "expired";
}

const VerifyEmail: NextPage<PageProps> = (props) => {
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.accounts.verifyEmail;

	return (
		<div className={styles["page"]}>
			<Head>
				<title>{lang.pageTitle}</title>
			</Head>

			<main>
				<div>
					{props.success == false && (
						<div>
							<p>{lang[props.error]}</p>
						</div>
					)}

					{props.success == true && (
						<div>
							<p>{lang.success}</p>
						</div>
					)}

					<Link href={props.user == undefined ? "/login" : "/home"}>
						{props.user == undefined ? lang.login : lang.goHome}
					</Link>
				</div>
			</main>
		</div>
	);
};

export default VerifyEmail;
