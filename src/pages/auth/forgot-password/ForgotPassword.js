import { Link } from "react-router-dom";

import "./ForgotPassword.scss";
import { FaArrowLeft } from "react-icons/fa";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";

const ForgotPassword = () => {
	return (
		<div className="container-wrapper">
			<div className="container-wrapper-auth">
				<div className="tabs forgot-password-tabs">
					<div className="tabs-auth">
						<ul className="tab-group">
							<li className="tab">
								<div className="login forgot-password">Forgot Password</div>
							</li>
						</ul>

						<div className="tab-item">
							<div className="auth-inner">
								<div className="alerts" role="alert">
									Error message
								</div>
								<form className="forgot-password-form">
									<div className="form-input-container">
										<Input
											id="email"
											name="email"
											type="email"
											value="my email"
											text="Email"
											placeholder="Email"
											onChange={() => {}}
										/>
									</div>
									<Button
										text="FORGOT PASSWORD"
										className="auth-button button"
										disabled={false}
									/>

									<Link to={"/"}>
										<span className="login">
											<FaArrowLeft className="arrow-left" /> Back to Login
										</span>
									</Link>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
