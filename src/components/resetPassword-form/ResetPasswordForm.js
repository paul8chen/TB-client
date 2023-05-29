import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Form, useActionData, useNavigation, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import "@components/resetPassword-form/ResetPasswordForm.scss";
import InputConfirmPassword from "@components/input-confirmPassword/InputConfirmPassword";
import Button from "@components/button/Button";

const AuthForm = ({ action }) => {
	const [showMessage, setShowMessage] = useState(null);

	const actionData = useActionData();
	const status = actionData?.status;
	const message = actionData?.message;
	const isError = status === "error";
	const isSuccess = status === "success";

	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	useEffect(() => {
		if (isError | isSuccess) {
			console.log("useEffect");
			setShowMessage(true);
			const messageTimeout = setTimeout(() => {
				setShowMessage(null);
			}, 2000);
			return () => {
				clearTimeout(messageTimeout);
			};
		}
	}, [isError, isSuccess, setShowMessage, isSubmitting]);

	return (
		<div className="auth-inner">
			{showMessage && (
				<div
					className={`alerts ${isError ? "alert-error" : null} ${
						isSuccess ? "alert-success" : null
					}`}
					role="alert"
				>
					{message}
				</div>
			)}
			<Form method="POST" className="auth-form">
				<div className="form-input-container">
					<InputConfirmPassword />
				</div>
				<Button
					text={
						isSubmitting
							? "SUBMITTING..."
							: action
									.split(" ")
									.map((act) => act.toUpperCase())
									.join("  ")
					}
					className="button auth-button"
					name="action"
					value={action}
				></Button>
				<Link to={"/"} className="button login">
					<FaArrowLeft className="arrow-left" />
					<span>Back to Login</span>
				</Link>
			</Form>
		</div>
	);
};

AuthForm.propTypes = {
	action: PropTypes.string,
	inputs: PropTypes.array,
};

export default AuthForm;
