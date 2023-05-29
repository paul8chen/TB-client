import { json } from "react-router-dom";

import "@pages/auth/reset-password/ResetPassword.scss";
import ResetPasswordForm from "@components/resetPassword-form/ResetPasswordForm";
import { authService } from "@services/api/auth.service";

const ResetPassword = () => {
	return (
		<div className="container-wrapper">
			<div className="container-wrapper-auth">
				<div className="tabs reset-password-tabs">
					<div className="tabs-auth">
						<ul className="tab-group">
							<li className="tab">
								<div className="login reset-password">Reset Password</div>
							</li>
						</ul>
						<div className="tab-item">
							<ResetPasswordForm action="reset password" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;

export async function action({ request }) {
	const queryParams = new URLSearchParams(window.location.search);
	const token = queryParams.get("token");

	if (!token) return json({ status: "error", message: "Invalid token." });

	const data = await request.formData();

	const password = data.get("password");
	const confirmPassword = data.get("confirmPassword");

	const response = await authService.resetPassword(
		{
			password,
			confirmPassword,
		},
		token
	);
	if (response.status === 404)
		return json({ status: "error", message: "Server unavilable." });
	console.log(response);

	return response;
}
