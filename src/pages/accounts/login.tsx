import * as React from "react";
import { motion } from "framer-motion";

import axios, { AxiosResponse } from "axios";

import validator from "validator";
import { z } from "zod";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Footer from "@/components/footer";
import Dialog from "@/components/dialog";

import styles from "../../styles/accounts/login.module.scss";

import { GetServerSideProps, NextPage } from "next";
import type { LoginRequestBody, LoginResponse } from "../../../shared/types/api/accounts";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import LangPack from "../../../shared/types/lang";

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

const Login: NextPage = () => {
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.accounts.login;
	const router = useRouter();

	// Inputs
	const emailInput = React.useRef<HTMLInputElement>(null);
	const passwordInput = React.useRef<HTMLInputElement>(null);
	const tfaInput = React.useRef<HTMLInputElement>(null);

	// Page that is showing
	const [currentPage, setCurrentPage] = React.useState<"login-form" | "tfa-form">("login-form");
	const [showingErrorDialog, setShowingErrorDialog] = React.useState(false);
	const [error, setError] = React.useState<keyof typeof LangPack.accounts.login.errors>("no-errors");

	// When login button clicked
	const handleLogin = async (event: React.MouseEvent) => {
		event.preventDefault();
		setError("no-errors");

        if (currentPage == "tfa-form" && passwordInput.current!.value == "") {
			setError("invalid-tfa-code");
			return setShowingErrorDialog(true);
        }

		const parsedBody = z
			.object({
				email: z.string().refine(validator.isEmail, {
					message: "invalid-email",
				}),
				password: z.string().nonempty({ message: "invalid-password" }),
			})
			.required()
			.safeParse({
				email: emailInput.current!.value,
				password: passwordInput.current!.value,
			});

		if (!parsedBody.success && 'error' in parsedBody && 'error' in parsedBody) {
			setError(parsedBody.error.errors[0].message as "invalid-email" | "invalid-password");
			return setShowingErrorDialog(true);
		}

		// Send the request to the login api
		const response: AxiosResponse<LoginResponse> = await axios({
			method: "POST",
			baseURL: `/api/accounts/login`,
			data: {
				email: emailInput.current!.value,
				password: passwordInput.current!.value,
				tfaCode: tfaInput.current!.value,
			} as LoginRequestBody,
		});

		// If the login was successful, redirect to the main window
		if (response.data == "done") return router.push("/home");
		if (response.data == "requires-tfa") return setCurrentPage("tfa-form");

		// If not, show the dialog and the error
		setError(response.data);
		setShowingErrorDialog(true);
	};

	return (
		<div className={styles["page"]}>
			<Head>
				<title>{lang.pageTitle}</title>
			</Head>

			<Dialog dialogOpen={showingErrorDialog}>
				<p>{lang.errors[error]}</p>

				<button onClick={() => setShowingErrorDialog(false)}>{lang.close}</button>
			</Dialog>

			<main>
				<motion.div
					variants={{
						visible: {
							opacity: 1,
							transition: { duration: 0.3 },
							display: "block",
						},
						hidden: {
							opacity: 0,
							transition: { duration: 0.3 },
							transitionEnd: {
								display: "none",
							},
						},
					}}
					initial="hidden"
					animate={currentPage == "login-form" ? "visible" : "hidden"}
					className={styles["login-form"]}
				>
					<h3>{lang.title}</h3>

					<br />

					<label htmlFor="email">{lang.email}</label>
					<input type="email" name="email" ref={emailInput} placeholder="user@example.com" />

					<br />
					<br />

					<label htmlFor="password">{lang.password}</label>
					<input type="password" name="password" ref={passwordInput} placeholder="••••••••" />

					<br />
					<br />
					<br />

					<div className={styles["buttons"]}>
						<button className={styles["login-button"]} onClick={(event) => handleLogin(event)}>
							{lang.login}
						</button>
						<Link href="/register">
							<button className={styles["no-account-button"]}>{lang.doNotHaveAnAccount}</button>
						</Link>
					</div>
				</motion.div>

				<motion.div
					variants={{
						visible: {
							opacity: 1,
							y: 0,
							transition: { duration: 0.5 },
						},
						hidden: {
							opacity: 0,
							y: 50,
							transition: { duration: 0.5 },
						},
						hiddenAndGone: {
							opacity: 0,
							y: 50,
							transition: { duration: 0.5 },
							display: "none",
						},
					}}
					initial="hidden"
					animate={currentPage == "tfa-form" ? "visible" : "hiddenAndGone"}
					exit="hiddenAndGone"
					className={styles["login-form"]}
				>
				<h1>{lang.tfa}</h1>	
					<label htmlFor="tfa-code">{lang.tfaHelp}</label>
					<input type="text" id="tfa-code" ref={tfaInput} placeholder="••••••" />

					<br />
					<br />

					<div className={styles["buttons"]}>
						<button className={styles["login-button"]} onClick={(event) => handleLogin(event)}>
							{lang.login}
						</button>


						<button className={styles["login-button"]} onClick={(event) => setCurrentPage("login-form")}>
							{lang.close}
						</button>
					</div>
				</motion.div>

				<Footer />
			</main>
		</div>
	);
};

export default Login;
