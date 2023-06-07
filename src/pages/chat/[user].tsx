import React from "react";
import { get, set } from "idb-keyval";
import { Socket, io } from "socket.io-client";
import axios, { AxiosResponse } from "axios";

import Head from "next/head";

import styles from "../../styles/chat/index.module.scss";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { User } from "../../../shared/types/models";
import { GetPublicKeyResponse, GetPublicKeyRequestBody } from "../../../shared/types/api/crypto";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (!context.req.isAuthenticated())
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};

	// If the requested contact isn't in the user's contact list
	const contact = context.req.user.contacts.find((contact: { username: string; userID: string }) => {
		if (contact.username.toLowerCase() == context.query.user) return contact;
		else return undefined;
	});

	if (contact == undefined)
		return {
			redirect: {
				destination: "/home",
				permanent: false,
			},
		};

	return {
		props: {
			user: JSON.parse(JSON.stringify(context.req.user)),
			contact: contact,
		},
	};
};

interface PageProps {
	user: User;
	contact: {
		userID: string;
		username: string;
	};
}

const Chat: NextPage<PageProps> = (props) => {
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.main.home;

	const [socket, setSocket] = React.useState<Socket>(null);
	const [contactInfo, setContactInfo] = React.useState(null);

	const messageInputRef = React.useRef<HTMLInputElement>();

	const [pubKey, setPubKey] = React.useState<CryptoKey>();
	const [privKey, setPrivKey] = React.useState<CryptoKey>();

	const sendMessage = async () => {
		if (socket !== null) {
			const encryptedText = await cryptoMethods.encrypt(messageInputRef.current!.value);
			console.log(encryptedText);

			const base64Message = Buffer.from(encryptedText).toString("base64");

            // TODO: Save message to the device in plain text

			socket.emit("message", {
				content: base64Message,
				timestamp: Date.now(),
				authorID: props.user.userID,
				contactID: props.contact.userID,
			});
		}
	};

	const cryptoMethods = {
		encrypt: async (text: string) => {
			const encoder = new TextEncoder();
			const dataBuffer = encoder.encode(text);

			const encryptedText = await window.crypto.subtle.encrypt(
				{
					name: "RSA-OAEP",
				},
				pubKey,
				dataBuffer
			);

			return encryptedText;
		},
		decrypt: async (encryptedText: ArrayBuffer) => {
			const textDecoder = new TextDecoder("utf-8");

			const decryptedText = await window.crypto.subtle.decrypt(
				{
					name: "RSA-OAEP",
				},
				privKey,
				encryptedText
			);

			return textDecoder.decode(decryptedText);
		},
	};

	React.useEffect(() => {
		const socket = io();
		socket.on("connect", () => {
			setSocket(socket);
			console.log("Websocket connected!");

			// Connect to the chat
			socket.emit("join-chat", { userID: props.user.userID, contactID: props.contact.userID });

			socket.on("message", async (data) => {
				const encryptedBuffer = Uint8Array.from(Buffer.from(data.content, "base64")).buffer;
				const decryptedText = await cryptoMethods.decrypt(encryptedBuffer);

                // TODO: add a trycatch method, store message in localstorage, show message in chat
				console.log("Decrypted: ", decryptedText);
			});
		});

		// Retrieve the user's keys
		(async () => {
			const response: AxiosResponse<GetPublicKeyResponse> = await axios({
				url: "/api/crypto/get-public-key",
				method: "POST",
				data: {
					user: props.contact.userID,
				} as GetPublicKeyRequestBody,
			});

			// This means the user requested was not found, which would be a pretty weird case
			if (typeof response.data == "boolean") return (window.location.href = "/home");

			const privateKeyData = await get("priv-key");
			const publicKeyData = Buffer.from(response.data, "base64"); // TODO THIS KEY IS FROM THE OTHER USER

			if (!privateKeyData || !publicKeyData) return (window.location.href = "/home");

			const privateKeyBuffer = privateKeyData.buffer.slice(
				privateKeyData.byteOffset,
				privateKeyData.byteOffset + privateKeyData.byteLength
			);
			const publicKeyBuffer = publicKeyData.buffer.slice(
				publicKeyData.byteOffset,
				publicKeyData.byteOffset + publicKeyData.byteLength
			);

			const importedPrivateKey = await window.crypto.subtle.importKey(
				"pkcs8",
				privateKeyBuffer,
				{
					name: "RSA-OAEP",
					hash: "SHA-256",
				},
				true,
				["decrypt"]
			);

			const importedPublicKey = await window.crypto.subtle.importKey(
				"spki",
				publicKeyBuffer,
				{
					name: "RSA-OAEP",
					hash: "SHA-256",
				},
				true,
				["encrypt"]
			);

			setPrivKey(importedPrivateKey);
			setPubKey(importedPublicKey);
		})();
	}, []);

	return (
		<div className={styles["page"]}>
			<Head>
				<title>{lang.pageTitle}</title>
			</Head>

			<main>
				<div className={styles["chat-navbar"]}>
					<div className={styles["navbar-left"]}>
						<div className={styles["go-back-button"]}>
							<img src="/assets/svg/chevron-left.svg" alt="Go back" />
						</div>
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
					</div>
				</div>

				<div className={styles["chat-content"]}>
					<h1>jeiqwoej1</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej</h1>
					<h1>jeiqwoej3</h1>
				</div>

				<div className={styles["message-bar"]}>
					<input ref={messageInputRef} type="text" className={styles["message-input"]} />

					<div className={styles["message-bar-buttons"]}>
						<img src="/assets/svg/send.svg" alt="Send" onClick={sendMessage} />
					</div>
				</div>
			</main>
		</div>
	);
};

export default Chat;
