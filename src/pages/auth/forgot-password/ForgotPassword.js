import { json } from "react-router-dom";

import "@pages/auth/forgot-password/ForgotPassword.scss";
import AuthForm from "@components/auth-form/AuthForm";
import { authService } from "@services/api/auth.service";

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
							<AuthForm action="forgot password" inputs={["email"]} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;

export async function action({ request }) {
	const data = await request.formData();
	const email = data.get("email");

	const response = await authService.forgotPassword({
		email,
	});

	if (response.status === 404)
		return json({ status: "error", message: "Server unavilable." });

	return response;
}
