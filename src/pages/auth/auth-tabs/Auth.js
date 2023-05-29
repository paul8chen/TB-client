import React, { useState } from "react";
import { json } from "react-router-dom";

import "./Auth.scss";
import { authService } from "../../../services/api/auth.service";
import AuthForm from "../../../components/auth-form/AuthForm";
import { Utlis } from "../../../services/utils/utils.service";

const Auth = () => {
	const [authTab, setAuthTab] = useState("login");

	const authTabClickHandler = (e) => {
		setAuthTab(e.target.className);
	};

	return (
		<>
			<div className="container-wrapper">
				<div className="environment">DEV</div>
				<div className="container-wrapper-auth">
					<div className="tabs">
						<div className="tabs-auth">
							<ul className="tab-group">
								<li className={`tab ${authTab === "login" ? "active" : ""}`}>
									<button className="login" onClick={authTabClickHandler}>
										LogIn
									</button>
								</li>
								<li className={`tab ${authTab === "signup" ? "active" : ""}`}>
									<button className="signup" onClick={authTabClickHandler}>
										SignUp
									</button>
								</li>
							</ul>
							{authTab === "login" && (
								<div className="tab-item">
									<AuthForm action="login" inputs={["username", "password"]} />
								</div>
							)}
							{authTab === "signup" && (
								<div className="tab-item">
									<AuthForm
										action="signup"
										inputs={["username", "password", "email"]}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Auth;

export async function action({ request }) {
	const data = await request.formData();
	const action = data.get("action");
	const username = data.get("username");
	const password = data.get("password");

	let response;
	if (action === "signup") {
		const email = data.get("email");
		const avatarColor = Utlis.avatarColor();
		const avatarImage = Utlis.generateAvatar(
			username.charAt(0).toUpperCase(),
			avatarColor
		);

		response = await authService.signup({
			email,
			username,
			password,
			avatarColor,
			avatarImage,
		});
	}

	if (action === "login") {
		response = await authService.login({
			username,
			password,
		});
	}

	if (response.status === 404)
		return json({ status: "error", message: "Server unavilable." });

	return response;
}
