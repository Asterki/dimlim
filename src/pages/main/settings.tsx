import React, { HTMLInputTypeAttribute } from "react";
import axios, { AxiosResponse } from "axios";
import validator from "validator";
import QRCode from "qrcode";
import speakeasy from "speakeasy";

import { useRouter } from "next/router";
import Head from "next/head";
import * as Tabs from "@radix-ui/react-tabs";
import Dialog from "@/components/dialog";

import styles from "../../styles/main/settings.module.scss";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { GetServerSideProps, NextPage } from "next";
import { User } from "../../../shared/types/models";

import {
	ActivateTFARequestBody,
	ActivateTFAResponse,
	ChangeEmailRequestBody,
	ChangeEmailResponse,
	ChangePasswordRequestBody,
	ChangePasswordResponse,
	DeactivateTFARequestBody,
	DeactivateTFAResponse,
	SendVerifyEmailRequestBody,
	SendVerifyEmailResponse,
	RemoveAvatarResponse,
} from "../../../shared/types/api/users";
import { UploadAvatarRequestBody, UploadAvatarResponse } from "../../../shared/types/api/upload";
import { DeleteAccountRequestBody, DeleteAccountResponse } from "../../../shared/types/api/accounts";
import LangPack from "../../../shared/types/lang";

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
	const lang = appState.page.lang.main.settings;

	const [currentTab, setCurrentTab] = React.useState<string>("profile");

	// Security dialogs
	const [securityActivateTFADialogOpen, setSecurityActivateTFADialogOpen] = React.useState<boolean>(false);
	const [securityDeactivateTFADialogOpen, setSecurityDeactivateTFADialogOpen] = React.useState<boolean>(false);
	const [securityChangePasswordDialogOpen, setSecurityChangePasswordDialogOpen] = React.useState<boolean>(false);

	// Account dialogs
	const [accountVerifyEmailDialogOpen, setAccountVerifyEmailDialogOpen] = React.useState<boolean>(false);
	const [accountVerifyEmailSentDialogOpen, setAccountVerifyEmailSentDialogOpen] = React.useState<boolean>(false);
	const [accountChangeEmailDialogOpen, setAccountChangeEmailDialogOpen] = React.useState<boolean>(false);
	const [accountLogoutDialogOpen, setAccountLogoutDialogOpen] = React.useState<boolean>(false);
	const [accountDeleteAccountDialogOpen, setAccountDeleteAccountDialogOpen] = React.useState<boolean>(false);

	// Profile refs
	const profileChangeAvatarInput = React.useRef<HTMLInputElement>(null);
	const profileChangeAvatarCanvas = React.useRef<HTMLCanvasElement>(null);

	// Account refs
	const accountChangeEmailEmailInput = React.useRef<HTMLInputElement>(null);
	const accountChangeEmailPasswordInput = React.useRef<HTMLInputElement>(null);

	const accountDeleteAccountPasswordInput = React.useRef<HTMLInputElement>(null);
	const accountDeleteAccountTFAInput = React.useRef<HTMLInputElement>(null);

	// Security refs
	const securityChangePasswordPasswordInput = React.useRef<HTMLInputElement>(null);
	const securityChangePasswordNewPasswordInput = React.useRef<HTMLInputElement>(null);
	const securityChangePasswordConfirmPasswordInput = React.useRef<HTMLInputElement>(null);

	const securityActivateTFACodeInput = React.useRef<HTMLInputElement>(null);

	const securityDeactivateTFACodeInput = React.useRef<HTMLInputElement>(null);

	// Errors on dialogs
	const [accountChangeEmailError, setAccountChangeEmailError] =
		React.useState<keyof typeof LangPack.main.settings.dialogs.account.changeEmail.errors>("no-errors");
	const [accountDeleteAccountError, setAccountDeleteAccountError] =
		React.useState<keyof typeof LangPack.main.settings.dialogs.account.deleteAccount.errors>("no-errors");

	const [securityChangePasswordError, setSecurityChangePasswordError] =
		React.useState<keyof typeof LangPack.main.settings.dialogs.security.changePassword.errors>("no-errors");
	const [securityActivateTFAError, setSecurityActivateTFAError] =
		React.useState<keyof typeof LangPack.main.settings.dialogs.security.activateTFA.errors>("no-errors");
	const [securityDeactivateTFAError, setSecurityDeactivateTFAError] =
		React.useState<keyof typeof LangPack.main.settings.dialogs.security.deactivateTFA.errors>("no-errors");

	// Extras
	const [securityActivateTFAImage, setSecurityActivateTFAImage] = React.useState<string>("");
	const [securityActivateTFACode, setSecurityActivateTFACode] = React.useState<string>("");

	// Options related to the profile menu
	const profileActions = {
		changeAvatar: (event: React.ChangeEvent<HTMLInputElement>) => {
			if (!event.target.files) return;
			const file = event.target.files[0];

			let reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onloadend = () => {
				const canvas = profileChangeAvatarCanvas.current!;

				let baseImage = new Image();
				baseImage.src = reader.result as string;

				baseImage.onload = async () => {
					const context = canvas.getContext("2d")!;
					context.drawImage(baseImage, 0, 0, 500, 500);

					const response: AxiosResponse<UploadAvatarResponse> = await axios({
						url: `/api/upload/avatar`,
						method: "POST",
						data: {
							image: canvas.toDataURL("image/jpeg", 0.7),
						},
					});

					if (response.data == "done") return window.location.reload();
				};
			};
		},
		removeAvatar: async () => {
			const response: AxiosResponse<RemoveAvatarResponse> = await axios({
				url: `/api/users/remove-avatar`,
				method: "POST",
			});

			if (response.data == "done") return window.location.reload();
		},
	};

	// Options related to the security menu
	const securityActions = {
		activateTFA: async () => {
			setSecurityActivateTFAError("no-errors");

			const response: AxiosResponse<ActivateTFAResponse> = await axios({
				method: "POST",
				url: `/api/users/activate-tfa`,
				data: {
					tfaCode: securityActivateTFACodeInput.current!.value,
					tfaSecret: securityActivateTFACode,
				} as ActivateTFARequestBody,
			});

			if (response.data !== "done") return setSecurityActivateTFAError(response.data);
			return router.push("/home");
		},
		deactivateTFA: async () => {
			setSecurityDeactivateTFAError("no-errors");

			const response: AxiosResponse<DeactivateTFAResponse> = await axios({
				method: "POST",
				url: `/api/users/deactivate-tfa`,
				data: {
					password: securityActivateTFACodeInput.current!.value,
				} as DeactivateTFARequestBody,
			});

			if (response.data !== "done") return setSecurityDeactivateTFAError(response.data);
			return router.push("/home");
		},
		changePassword: async () => {
			setSecurityChangePasswordError("no-errors");

			// Checks before sending the request
			if (
				securityChangePasswordNewPasswordInput.current!.value !==
				securityChangePasswordConfirmPasswordInput.current!.value
			)
				return setSecurityChangePasswordError("invalid-password");

			const response: AxiosResponse<ChangePasswordResponse> = await axios({
				method: "POST",
				url: `/api/users/change-password`,
				data: {
					password: securityChangePasswordPasswordInput.current!.value,
					newPassword: securityChangePasswordConfirmPasswordInput.current!.value,
				} as ChangePasswordRequestBody,
			});

			if (response.data !== "done") return setSecurityChangePasswordError(response.data);
			router.push("/home");
		},
	};

	// Options related to the account menu
	const accountActions = {
		logout: async () => {
			// Logout the account
			const response: AxiosResponse<"ok"> = await axios({
				url: `/api/accounts/logout`,
				method: "POST",
			});

			// TODO: Delete all messages

			// Redirect to the main page
			if (response.data == "ok") return router.push("/");
		},
		changeEmail: async () => {
			setAccountChangeEmailError("no-errors");

			// Check that the provided email is indeed a valid email before sending it to the server
			if (!validator.isEmail(accountChangeEmailEmailInput.current!.value))
				return setAccountChangeEmailError("invalid-parameters");

			// Send the request
			const response: AxiosResponse<ChangeEmailResponse> = await axios({
				method: "POST",
				withCredentials: true,
				url: `/api/users/change-email`,
				data: {
					newEmail: accountChangeEmailEmailInput.current?.value,
					password: accountChangeEmailPasswordInput.current?.value,
				} as ChangeEmailRequestBody,
			});

			// Redirect out of the settings
			if (response.data !== "done") return setAccountChangeEmailError(response.data);
			else router.push("/home");
		},
		deleteAccount: async () => {
			setAccountDeleteAccountError("no-errors");

			// Send the request
			const response: AxiosResponse<DeleteAccountResponse> = await axios({
				method: "POST",
				withCredentials: true,
				url: `/api/accounts/delete-account`,
				data: {
					password: accountDeleteAccountPasswordInput.current?.value,
					tfaCode:
						accountDeleteAccountTFAInput.current !== null
							? accountDeleteAccountTFAInput.current?.value
							: "no-tfa-code",
				} as DeleteAccountRequestBody,
			});

			// Redirect out of the settings
			if (response.data !== "done") return setAccountDeleteAccountError(response.data);
			else router.push("/home");
		},
		verifyEmail: async () => {
			// Send the request
			const response: AxiosResponse<SendVerifyEmailResponse> = await axios({
				method: "POST",
				withCredentials: true,
				url: `/api/users/send-email-verification-email`,
				data: {
					locale: lang.dialogs.account.verifyEmail.currentLocale,
				} as SendVerifyEmailRequestBody,
			});

			setAccountVerifyEmailSentDialogOpen(true);
			setAccountVerifyEmailDialogOpen(false);
		},
	};

	// Generate a TFA code when the dialog is opened
	React.useEffect(() => {
		const secret = speakeasy.generateSecret({ issuer: "DIMLIM", name: `${props.user.username} DIMLIM`, otpauth_url: true });

		QRCode.toDataURL(secret.otpauth_url as string, (err: unknown, url: string) => {
			setSecurityActivateTFAImage(url);
			setSecurityActivateTFACode(secret.base32);
		});
	}, [securityActivateTFADialogOpen]);

	return (
		<div className={styles["page"]}>
			<Head>
				<title>{lang.pageTitle}</title>
			</Head>

			{/* Security Dialogs */}
			<div>
				{/* Activate TFA */}
				<Dialog dialogOpen={securityActivateTFADialogOpen}>
					<h1>{lang.dialogs.security.activateTFA.title}</h1>
					<p>{lang.dialogs.security.activateTFA.instructions}</p>

					<img src={securityActivateTFAImage} alt="qr code" />

					<br />
					<br />

					<label htmlFor="security-activate-tfa-code-input">{lang.dialogs.security.activateTFA.label}</label>
					<input
						type="text"
						ref={securityActivateTFACodeInput}
						placeholder="••••••"
						id="security-activate-tfa-code-input"
					/>

					<p className={styles["error"]}>{lang.dialogs.security.activateTFA.errors[securityActivateTFAError]}</p>

					<button onClick={() => securityActions.activateTFA()}>{lang.dialogs.security.activateTFA.activate}</button>
					<br />
					<button onClick={() => setSecurityActivateTFADialogOpen(false)}>
						{lang.dialogs.security.activateTFA.cancel}
					</button>
				</Dialog>

				{/* Deactivate TFA */}
				<Dialog dialogOpen={securityDeactivateTFADialogOpen}>
					<h1>{lang.dialogs.security.deactivateTFA.title}</h1>

					<label htmlFor="security-deactivate-tfa-password-input">{lang.dialogs.security.deactivateTFA.label}</label>
					<input
						type="password"
						ref={securityDeactivateTFACodeInput}
						placeholder="••••••••"
						id="security-deactivate-tfa-password-input"
					/>

					<br />
					<p className={styles["error"]}>{lang.dialogs.security.deactivateTFA.errors[securityDeactivateTFAError]}</p>

					<button onClick={() => securityActions.deactivateTFA()}>
						{lang.dialogs.security.deactivateTFA.deactivate}
					</button>
					<br />
					<button onClick={() => setSecurityDeactivateTFADialogOpen(false)}>
						{lang.dialogs.security.deactivateTFA.cancel}
					</button>
				</Dialog>

				{/* Change password */}
				<Dialog dialogOpen={securityChangePasswordDialogOpen}>
					<h1>{lang.dialogs.security.changePassword.title}</h1>

					<label htmlFor="security-change-password-password-input">
						{lang.dialogs.security.changePassword.passwordLabel}
					</label>
					<input
						type="password"
						ref={securityChangePasswordPasswordInput}
						placeholder="••••••••"
						id="security-change-password-password-input"
					/>

					<br />
					<br />

					<label htmlFor="security-change-password-new-password-input">
						{lang.dialogs.security.changePassword.newPasswordLabel}
					</label>
					<input
						type="password"
						ref={securityChangePasswordNewPasswordInput}
						placeholder="••••••••"
						id="security-change-password-new-password-input"
					/>

					<br />
					<br />

					<label htmlFor="security-change-password-confirm-password-input">
						{lang.dialogs.security.changePassword.newPasswordConfirmLabel}
					</label>
					<input
						type="password"
						ref={securityChangePasswordConfirmPasswordInput}
						placeholder="••••••••"
						id="security-change-password-confirm-password-input"
					/>

					<br />
					<p className={styles["error"]}>{lang.dialogs.security.changePassword.errors[securityChangePasswordError]}</p>

					<button onClick={() => securityActions.changePassword()}>
						{lang.dialogs.security.changePassword.submit}
					</button>
					<br />
					<button onClick={() => setSecurityChangePasswordDialogOpen(false)}>
						{lang.dialogs.security.changePassword.cancel}
					</button>
				</Dialog>
			</div>

			{/* Account Dialogs */}
			<div>
				{/* Logout */}
				<Dialog dialogOpen={accountLogoutDialogOpen}>
					<h1>{lang.dialogs.account.logout.title}</h1>
					<p>{lang.dialogs.account.logout.description}</p>
					<br />

					<button onClick={() => accountActions.logout()}>{lang.dialogs.account.logout.logout}</button>
					<br />
					<button onClick={() => setAccountLogoutDialogOpen(false)}>{lang.dialogs.account.logout.cancel}</button>
				</Dialog>

				{/* Verify Email */}
				<Dialog dialogOpen={accountVerifyEmailDialogOpen}>
					<h1>{lang.dialogs.account.verifyEmail.title}</h1>
					<p>{lang.dialogs.account.verifyEmail.description}</p>
					<br />

					<button onClick={() => accountActions.verifyEmail()}>{lang.dialogs.account.verifyEmail.submit}</button>
					<br />
					<button onClick={() => setAccountVerifyEmailDialogOpen(false)}>
						{lang.dialogs.account.verifyEmail.cancel}
					</button>
				</Dialog>

				{/* Verify Email Sent */}
				<Dialog dialogOpen={accountVerifyEmailSentDialogOpen}>
					<h1>{lang.dialogs.account.verifyEmailSent.title}</h1>
					<p>{lang.dialogs.account.verifyEmailSent.description.replace("{email}", props.user.email.value)}</p>
					<br />

					<button onClick={() => setAccountVerifyEmailSentDialogOpen(false)}>
						{lang.dialogs.account.verifyEmailSent.close}
					</button>
				</Dialog>

				{/* Change email */}
				<Dialog dialogOpen={accountChangeEmailDialogOpen}>
					<h1>{lang.dialogs.account.changeEmail.title}</h1>

					<label htmlFor="account-change-email-email-input">{lang.dialogs.account.changeEmail.newEmailLabel}</label>
					<input
						type="email"
						ref={accountChangeEmailEmailInput}
						placeholder="user@example.com"
						id="account-change-email-email-input"
					/>

					<br />
					<br />

					<label htmlFor="account-change-email-password-input">
						{lang.dialogs.account.changeEmail.currentPasswordLabel}
					</label>
					<input
						type="password"
						ref={accountChangeEmailPasswordInput}
						placeholder="••••••••"
						id="account-change-email-password-input"
					/>

					<br />

					<p className={styles["error"]}>{lang.dialogs.account.changeEmail.errors[accountChangeEmailError]}</p>

					<button onClick={() => accountActions.changeEmail()}>{lang.dialogs.account.changeEmail.submit}</button>
					<br />
					<button onClick={() => setAccountChangeEmailDialogOpen(false)}>
						{lang.dialogs.account.changeEmail.cancel}
					</button>
				</Dialog>

				{/* Delete account */}
				<Dialog dialogOpen={accountDeleteAccountDialogOpen}>
					<h1>{lang.dialogs.account.deleteAccount.title}</h1>
					<p>
						{" "}
						<b> {lang.dialogs.account.deleteAccount.warning} </b>
					</p>

					{/* Password Input */}
					<label htmlFor="account-delete-account-password-input">
						{lang.dialogs.account.deleteAccount.passwordLabel}
					</label>
					<input
						type="password"
						ref={accountDeleteAccountPasswordInput}
						placeholder="••••••••"
						id="account-delete-account-password-input"
					/>

					{/* TFA Input */}
					{props.user.tfa.secret !== "" && (
						<div>
							<br />
							<br />

							<label htmlFor="account-delete-account-tfa-input">
								{lang.dialogs.account.deleteAccount.tfaLabel}
							</label>
							<input
								type="text"
								ref={accountDeleteAccountTFAInput}
								placeholder="••••••"
								id="account-delete-account-tfa-input"
							/>
						</div>
					)}

					<br />

					<p className={styles["error"]}>{lang.dialogs.account.deleteAccount.errors[accountDeleteAccountError]}</p>

					<button onClick={() => accountActions.deleteAccount()}>{lang.dialogs.account.deleteAccount.submit}</button>
					<br />
					<button onClick={() => setAccountDeleteAccountDialogOpen(false)}>
						{lang.dialogs.account.deleteAccount.cancel}
					</button>
				</Dialog>
			</div>

			<main>
				<Tabs.Root value={currentTab} onValueChange={(tab) => setCurrentTab(tab)}>
					<Tabs.List className={styles["tab-triggers"]}>
						<Tabs.Trigger
							value="profile"
							className={`${styles["tab-trigger"]} ${currentTab == "profile" ? styles["tab-trigger-active"] : ""}`}
						>
							{lang.tabs.profile.tabLabel}
						</Tabs.Trigger>

						<Tabs.Trigger
							value="security"
							className={`${styles["tab-trigger"]} ${currentTab == "security" ? styles["tab-trigger-active"] : ""}`}
						>
							{lang.tabs.security.tabLabel}
						</Tabs.Trigger>

						<Tabs.Trigger
							value="messages"
							className={`${styles["tab-trigger"]} ${currentTab == "messages" ? styles["tab-trigger-active"] : ""}`}
						>
							{lang.tabs.messages.tabLabel}
						</Tabs.Trigger>

						<Tabs.Trigger
							value="account"
							className={`${styles["tab-trigger"]} ${currentTab == "account" ? styles["tab-trigger-active"] : ""}`}
						>
							{lang.tabs.account.tabLabel}
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="profile" className={styles["tab-content"]}>
						<br />
						<h1>{lang.tabs.profile.title}</h1>
						<br />

						<div className={styles["profile-overview"]}>
							<img
								src={
									props.user.avatar !== ""
										? `/avatars/${props.user.userID}/${props.user.avatar}.jpeg`
										: "/assets/images/default-avatar.png"
								}
								alt="user avatar"
							/>

							{/* Profile picture related */}
							<input
								hidden
								ref={profileChangeAvatarInput}
								onChange={(event) => {
									profileActions.changeAvatar(event);
								}}
								accept=".jpg, .png, .jpeg"
								type="file"
							/>

							<canvas hidden ref={profileChangeAvatarCanvas} width={500} height={500} />

							<br />

							<button
								className={styles["upload-picture-button"]}
								onClick={() => {
									profileChangeAvatarInput.current?.click();
								}}
							>
								{lang.tabs.profile.uploadAvatar}
							</button>

							<br />
							{props.user.avatar !== "" && (
								<button
									className={styles["upload-picture-button"]}
									onClick={() => {
										profileActions.removeAvatar();
									}}
								>
									{lang.tabs.profile.removeAvatar}
								</button>
							)}
							<br />

							<h3>{props.user.username}</h3>
							<p>{props.user.email.value}</p>

							<br />

							<p>
								{lang.tabs.profile.userID} {props.user.userID}
							</p>
							<p>
								{lang.tabs.profile.emailVerified}{" "}
								{props.user.email.verified ? lang.tabs.profile.yes : lang.tabs.profile.no}
							</p>
							<p>
								{lang.tabs.profile.tfaActive}{" "}
								{props.user.tfa.secret !== "" ? lang.tabs.profile.yes : lang.tabs.profile.no}
							</p>
						</div>
					</Tabs.Content>

					<Tabs.Content value="security" className={styles["tab-content"]}>
						<br />
						<h1>{lang.tabs.security.title}</h1>
						<br />

						{/* Activate TFA */}
						<div
							className={styles["tab-action"]}
							onClick={() => {
								if (props.user.tfa.secret !== "") {
									setSecurityDeactivateTFADialogOpen(true);
								} else {
									setSecurityActivateTFADialogOpen(true);
								}
							}}
						>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/settings-cog-check.svg" alt="settings-cog-check Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>
									{props.user.tfa.secret == ""
										? lang.tabs.security.tfa.activateTitle
										: lang.tabs.security.tfa.deactivateTitle}
								</h3>
								<p>{lang.tabs.security.tfa.description}</p>
							</div>
						</div>

						{/* Change Password */}
						<div
							className={styles["tab-action"]}
							onClick={() => {
								setSecurityChangePasswordDialogOpen(true);
							}}
						>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/password.svg" alt="password Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>{lang.tabs.security.changePassword.title}</h3>
								<p>{lang.tabs.security.changePassword.description}</p>
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="messages" className={styles["tab-content"]}>
						<br />
						<h1>{lang.tabs.messages.title}</h1>
						<br />

						{/* See contacts */}
						<div className={styles["tab-action"]}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/user-box.svg" alt="user-box Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>{lang.tabs.messages.seeContacts.title}</h3>
								<p>{lang.tabs.messages.seeContacts.description}</p>
							</div>
						</div>

						{/* See blocked contacts */}
						<div className={styles["tab-action"]}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/lock.svg" alt="lock Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>{lang.tabs.messages.seeBlockedContacts.title}</h3>
								<p>{lang.tabs.messages.seeBlockedContacts.description}</p>
							</div>
						</div>

						{/* Delete all messages */}
						<div className={styles["tab-action"]}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/delete-bin.svg" alt="delete-bin Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>{lang.tabs.messages.deleteAllMessages.title}</h3>
								<p>{lang.tabs.messages.deleteAllMessages.description}</p>
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="account" className={styles["tab-content"]}>
						<br />
						<h1>{lang.tabs.account.title}</h1>
						<br />

						{props.user.email.verified == false && (
							<div className={styles["tab-action"]} onClick={() => setAccountVerifyEmailDialogOpen(true)}>
								<div className={styles["tab-action-icon"]}>
									<img src="/assets/svg/mail.svg" alt="mail Icon" />
								</div>

								<div className={styles["tab-action-text"]}>
									<h3>{lang.tabs.account.verifyEmail.title}</h3>
									<p>{lang.tabs.account.verifyEmail.description}</p>
								</div>
							</div>
						)}

						<div className={styles["tab-action"]} onClick={() => setAccountChangeEmailDialogOpen(true)}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/mail.svg" alt="mail Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>{lang.tabs.account.changeEmail.title}</h3>
								<p>{lang.tabs.account.changeEmail.description}</p>
							</div>
						</div>

						<div className={styles["tab-action"]} onClick={() => setAccountLogoutDialogOpen(true)}>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/logout.svg" alt="Logout Icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>{lang.tabs.account.logout.title}</h3>
								<p>{lang.tabs.account.logout.description}</p>
							</div>
						</div>

						<div
							className={styles["tab-action"]}
							onClick={() => {
								setAccountDeleteAccountDialogOpen(true);
							}}
						>
							<div className={styles["tab-action-icon"]}>
								<img src="/assets/svg/delete-bin.svg" alt="delete icon" />
							</div>

							<div className={styles["tab-action-text"]}>
								<h3>{lang.tabs.account.deleteAccount.title}</h3>
								<p>{lang.tabs.account.deleteAccount.description}</p>
							</div>
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</main>
		</div>
	);
};

export default Settings;
