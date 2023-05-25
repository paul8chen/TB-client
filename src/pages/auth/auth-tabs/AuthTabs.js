import React, { useState } from "react";

import "./AuthTabs.scss";
import { Login, Signup } from "../index";

const AuthTabs = () => {
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
									<Login />
								</div>
							)}
							{authTab === "signup" && (
								<div className="tab-item">
									<Signup />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AuthTabs;
