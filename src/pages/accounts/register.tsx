import * as React from "react";
import axios, { AxiosResponse } from "axios";

import validator from "validator";
import { z } from "zod";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Footer from "../../components/footer";
import Dialog from "@/components/dialog";

import styles from "../../styles/accounts/register.module.scss";

import { GetServerSideProps, NextPage } from "next";
import { RegisterRequestBody, RegisterResponse } from "../../../shared/types/api/accounts";
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

const Register: NextPage = () => {
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.accounts.register;
	const router = useRouter();

	const emailInput = React.useRef<HTMLInputElement>(null);
	const usernameInput = React.useRef<HTMLInputElement>(null);
	const passwordInput = React.useRef<HTMLInputElement>(null);
	const confirmPasswordInput = React.useRef<HTMLInputElement>(null);

	const [showingErrorDialog, setShowingErrorDialog] = React.useState<boolean>(false);
	const [error, setError] = React.useState<keyof typeof LangPack.accounts.register.errors>("no-errors");

	const handleRegister = async (event: React.MouseEvent) => {
		event.preventDefault();
		setError("no-errors");

		// Verify inputs
		const parsedBody = z
			.object({
				username: z
					.string()
					.min(3, {
						message: "invalid-username-length",
					})
					.max(16, {
						message: "invalid-username-length",
					})
					.refine(
						(username) => {
							return validator.isAlphanumeric(username, "en-GB", { ignore: "._" });
						},
						{ message: "invalid-username" }
					),
				email: z.string().refine(validator.isEmail, {
					message: "invalid-email",
				}),
				password: z
					.string()
					.min(6, { message: "invalid-password-length" })
					.max(256, { message: "invalid-password-length" }),
				confirmPassword: z.string().refine(
					(password) => {
						return validator.equals(passwordInput.current!.value, password);
					},
					{ message: "password-match" }
				),
			})
			.required()
			.safeParse({
				username: usernameInput.current!.value,
				email: emailInput.current!.value,
				password: passwordInput.current!.value,
				confirmPassword: confirmPasswordInput.current!.value,
			});

		if (!parsedBody.success && 'error' in parsedBody && 'error' in parsedBody) {
			setError(
				parsedBody.error.errors[0].message as
					| "invalid-username-length"
					| "invalid-username"
					| "invalid-email"
					| "invalid-password-length"
					| "password-match"
			);
			return setShowingErrorDialog(true);
		}

		const response: AxiosResponse<RegisterResponse> = await axios({
			method: "POST",
			url: `/api/accounts/register`,
			data: {
				email: parsedBody.data.email,
				username: parsedBody.data.username,
				password: parsedBody.data.password,
			} as RegisterRequestBody,
		});

		if (response.data == "username-email-in-use") {
			setError(response.data);
			return setShowingErrorDialog(true);
		}

		if (response.data == "done") return router.push("/home");
	};

	return (
		<div>
			<div className={styles["page"]}>
				<Head>
					<title>{lang.pageTitle}</title>
				</Head>

				<Dialog dialogOpen={showingErrorDialog}>
					<p>{lang.errors[error]}</p>

					<button onClick={() => setShowingErrorDialog(false)}>{lang.close}</button>
				</Dialog>

				<main>
					<div className={styles["register-form"]}>
						<h3>{lang.title}</h3>
						<br />

						<label htmlFor="email">{lang.email}</label>
						<input type="email" name="email" ref={emailInput} placeholder="user@example.com" />

						<br />
						<br />

						<label htmlFor="username">{lang.username}</label>
						<input type="text" name="username" ref={usernameInput} placeholder="user" />

						<br />
						<br />

						<label htmlFor="password">{lang.password}</label>
						<input type="password" name="password" ref={passwordInput} placeholder="••••••••" />

						<br />
						<br />

						<label htmlFor="confirm-password">{lang.confirmPassword}</label>
						<input type="password" name="confirm-password" ref={confirmPasswordInput} placeholder="••••••••" />

						<br />
						<br />
						<br />

						<div className={styles["buttons"]}>
							<button className={styles["login-button"]} onClick={(event) => handleRegister(event)}>
								{lang.register}
							</button>
							<Link href="/login">
								<button className={styles["no-account-button"]}>{lang.alreadyHaveAnAccount}</button>
							</Link>
						</div>
					</div>
				</main>

				<Footer />
			</div>
		</div>
	);
};

export default Register;
