import React, { FunctionComponent, useState } from "react";
import styles from "./Chat.module.css";

const Chat: FunctionComponent = () => {
	const [inputValue, setInputValue] = useState("");
	const [isRequestPending, setIsRequestPending] = useState(false);

	const handleSendMessage = () => {
		if (inputValue.trim() !== "" && !isRequestPending) {
			setIsRequestPending(true);
			fetch("http://127.0.0.1:5000", {
				method: "POST",
				body: JSON.stringify({ message: inputValue }),
				headers: { "Content-Type": "application/json" },
			})
				.then((response) => response.json())
				.then((data) => {
					// TO:DO dodaj poruku
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
				<div className={styles.chatBox}></div>
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
