import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import Message from "../components/Message";
import styles from "./Chat.module.css";

type MessageType = {
	user: string;
	text: string;
};

const Chat: FunctionComponent = () => {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isRequestPending, setIsRequestPending] = useState(false);
	const chatContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (chatContainerRef.current !== null) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSendMessage = () => {
		if (inputValue.trim() !== "" && !isRequestPending) {
			const newMessage: MessageType = {
				user: "user",
				text: inputValue,
			};

			setMessages((prevMessages) => [...prevMessages, newMessage]);
			setIsRequestPending(true);
			fetch("http://127.0.0.1:5000", {
				method: "POST",
				body: JSON.stringify({ message: inputValue }),
				headers: { "Content-Type": "application/json" },
			})
				.then((response) => response.json())
				.then((data) => {
					let text = data.response.entities;
					text = "Playing " + text + " ♬";
					window.open(data.response.link);
					const newResponse: MessageType = {
						user: "assistant",
						text: text,
					};
					setMessages((prevMessages) => [...prevMessages, newResponse]);
					setIsRequestPending(false);
				})
				.catch((error) => {
					console.error("Error:", error);
					setIsRequestPending(false);
				});

			setInputValue("");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSendMessage();
		}
	};

	return (
		<div className={styles.content}>
			<div className={styles.chat}>
				<div className={styles.chatBox} ref={chatContainerRef}>
					{messages.map((message, index) => (
						<Message key={index} user={message.user} text={message.text} />
					))}
					{isRequestPending && <Message user="assistant" text="..." />}
				</div>
				<div className={styles.bottomContainer}>
					<div className={styles.searchBar}>
						<input
							className={styles.input}
							placeholder="Enter what you want to listen to"
							type="text"
							value={inputValue}
							onChange={handleInputChange}
							onKeyDown={handleInputKeyPress}
						/>
						<button className={styles.button} onClick={handleSendMessage}>
							{isRequestPending ? (
								<img
									className={styles.icon}
									src="/loading.gif"
									alt="Loading..."
								/>
							) : (
								<img className={styles.icon} src="/send.png" alt="Send" />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Chat;
