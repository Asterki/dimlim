import React from "react";
import { get, set } from "idb-keyval";
import axios, { AxiosResponse } from "axios";

import Head from "next/head";

import styles from "../../styles/chat/index.module.scss";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { socket } from "../../socket";

import { User } from "../../../shared/types/models";
import { GetPublicKeyResponse, GetPublicKeyRequestBody } from "../../../shared/types/api/crypto";
import { GetServerSideProps, NextPage } from "next";
import { v4 } from "uuid";

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

	const [contactInfo, setContactInfo] = React.useState<{ username: string; userID: string; avatar: string }>(null);
	const [chatMessages, setChatMessages] = React.useState<
		Array<{ content: string; timestamp: number; authorID: string; contactID: string; messageID: string }>
	>([]);

	const messageInputRef = React.useRef<HTMLInputElement>();

	const [pubKey, setPubKey] = React.useState<CryptoKey>();
	const [privKey, setPrivKey] = React.useState<CryptoKey>();

	const sendMessage = async () => {
		if (socket !== null) {
			const encryptedText = await cryptoMethods.encrypt(messageInputRef.current!.value);
			console.log(encryptedText);

			const base64Message = Buffer.from(encryptedText).toString("base64");

			// TODO: Save message to the device in plain text

			const message = {
				content: base64Message,
				timestamp: Date.now(),
				authorID: props.user.userID,
				contactID: props.contact.userID,
				messageID: v4(),
			};

			socket.emit("message", message);

			message.content = messageInputRef.current!.value;
			setChatMessages((chatMessages) => [...chatMessages, message]);
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
		// Retrieve the user's keys
		(async () => {
			// Get the user's profile picture
			const contactsResponse: AxiosResponse = await axios({
				method: "POST",
				url: "/api/users/get-contact-information",
				data: {
					contactID: props.contact.userID,
				},
			});

			if (contactsResponse.data == "unauthorized") return (window.location.href = "/login");
			setContactInfo(contactsResponse.data);

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
			const publicKeyData = Buffer.from(response.data, "base64");

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

	// This is added here because the private key is not quite updated after it's retrieved from the local storage
	// So when it updates, it can set the socket's listeners
	React.useEffect(() => {
		if (privKey !== undefined) {
			socket.emit("join-chat", { userID: props.user.userID, contactID: props.contact.userID });

			socket.on(
				"message",
				async (data: { content: string; timestamp: number; authorID: string; contactID: string; messageID: string }) => {
					try {
						const encryptedBuffer = Uint8Array.from(Buffer.from(data.content, "base64")).buffer;
						const decryptedText = await cryptoMethods.decrypt(encryptedBuffer);

						data.content = decryptedText;

						// TODO: store message in localstorage
						setChatMessages((chatMessages) => [...chatMessages, data]);
					} catch (err) {
						alert("There was an error receiving a message");
						window.location.href = "/home";
					}
				}
			);
		}
	}, [privKey]);

	const messages = chatMessages.map((message) => {
		return (
			<div className={`${styles["message"]}`} key={message.messageID}>
				<div
					className={`${styles["message-content"]} ${
						message.authorID == props.user.userID ? styles["message-sent"] : styles["message-received"]
					}`}
				>
					<p>{message.content}</p>
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
				<div className={styles["chat-navbar"]}>
					<div className={styles["navbar-left"]}>
						<div className={styles["go-back-button"]}>
							<img src="/assets/svg/chevron-left.svg" alt="Go back" />
						</div>
						{contactInfo !== null && (
							<div className={styles["contact-information"]}>
								<img
									src={
										contactInfo.avatar !== ""
											? `/avatars/${contactInfo.avatar}/${contactInfo.avatar}.jpeg`
											: "/assets/images/default-avatar.png"
									}
									alt="user avatar"
								/>
								<p>{contactInfo.username}</p>
							</div>
						)}
					</div>
				</div>

				<div className={styles["chat-content"]}>{messages}</div>

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
