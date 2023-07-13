import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
	Form,
	useActionData,
	useNavigation,
	Link,
	useNavigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import "@components/auth-form/AuthForm.scss";
import InputValidator from "@components/input-validator/InputValidator";
import Button from "@components/button/Button";
import useLocalStorage from "@hooks/useLocalStorage";
import { Utils } from "@services/utils/utils.service";

let firstSuccess = false;

const AuthForm = ({ action, inputs }) => {
	const [showMessage, setShowMessage] = useState(null);

	const actionData = useActionData();
	const status = actionData?.status;
	const message = actionData?.message;
	const isError = status === "error";
	const isSuccess = status === "success";

	const [setUsernameLocal] = useLocalStorage("username", "set");
	const [setUIdLocal] = useLocalStorage("uId", "set");

	const dispatch = useDispatch();

	if (isSuccess && !firstSuccess) {
		firstSuccess = true;
		Utils.saveUserStorage(
			actionData.data,
			setUsernameLocal,
			setUIdLocal,
			dispatch
		);
	}

	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	const navigate = useNavigate();

	useEffect(() => {
		if (isError | isSuccess) {
			setShowMessage(true);
			const messageTimeout = setTimeout(() => {
				setShowMessage(null);
				if (isSuccess) {
					navigate("/app/chart");
				}
			}, 2000);
			return () => {
				clearTimeout(messageTimeout);
			};
		}
	}, [isError, isSuccess, setShowMessage, isSubmitting, navigate]);

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
					{inputs.map((input) => (
						<InputValidator
							key={input}
							id={input}
							name={input}
							type={input === "password" || input === "email" ? input : "text"}
							text={input.slice(0, 1).toUpperCase() + input.slice(1)}
							placeholder={`My ${input}`}
						/>
					))}
				</div>
				<Button className="button auth-button" name="action" value={action}>
					{isSubmitting
						? "SUBMITTING..."
						: action
								.split(" ")
								.map((act) => act.toUpperCase())
								.join("  ")}
				</Button>
				<div className="action-button">
					{action === "login" && (
						<Link to="/forgot-password" className="button forgot-password">
							<span>Forgot password?</span>
							<FaArrowRight className="arrow-right" />
						</Link>
					)}

					{action === "forgot password" && (
						<Link to={"/"} className="button login">
							<FaArrowLeft className="arrow-left" />
							<span>Back to Login</span>
						</Link>
					)}
				</div>
			</Form>
		</div>
	);
};

AuthForm.propTypes = {
	action: PropTypes.string,
	inputs: PropTypes.array,
};

export default AuthForm;
