import { useState } from "react";

import "@components/input-confirmPassword/InputConfirmPassword.scss";
import Input from "@components/input/Input";
import { inputValidator } from "@services/utils/inputValidator";

const InputConfirmPassword = () => {
	// Validation of confirm password and password
	const [password, setPassword] = useState("");
	const [passwordIsValid, setPasswordIsValid] = useState(false);
	const [passwordIsClicked, setPasswordIsClicked] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(false);
	const [confirmPasswordIsClicked, setConfirmPasswordIsClicked] =
		useState(false);

	const passwordChangeHandler = (event) => {
		const enteredPassword = event.target.value;
		setPassword(enteredPassword);
		setPasswordIsValid(inputValidator.passwordValidator(enteredPassword));
	};

	const passwordBlurHandler = (event) => {
		setPasswordIsClicked(true);
		setPasswordIsValid(inputValidator.passwordValidator(event.target.value));
	};

	const confirmPasswordChangeHandler = (event) => {
		setConfirmPassword(event.target.value);
	};

	const confirmPasswordBlurHandler = (event) => {
		setConfirmPasswordIsClicked(true);
		setConfirmPasswordIsValid(event.target.value === password);
	};

	let confirmPasswordMessage = "";
	confirmPasswordMessage =
		confirmPassword === password
			? ""
			: "Confirm password and password not matched.";

	return (
		<>
			<Input
				key="password"
				id="password"
				name="password"
				type="password"
				text="Password"
				value={password}
				className={passwordIsClicked && !passwordIsValid ? "input-invalid" : ""}
				placeholder="My password"
				onChange={passwordChangeHandler}
				onBlur={passwordBlurHandler}
			/>
			{passwordIsClicked && !passwordIsValid ? (
				<p className="invalid">{inputValidator.passwordMessage}</p>
			) : null}
			<Input
				key="confirmPassword"
				id="confirmPassword"
				name="confirmPassword"
				type="password"
				text="Confirm Password"
				value={confirmPassword}
				className={
					confirmPasswordIsClicked && !confirmPasswordIsValid
						? "input-invalid"
						: ""
				}
				placeholder="My confirm password"
				onChange={confirmPasswordChangeHandler}
				onBlur={confirmPasswordBlurHandler}
			/>
			{confirmPasswordIsClicked && !confirmPasswordIsValid ? (
				<p className="invalid">{confirmPasswordMessage}</p>
			) : null}
		</>
	);
};

export default InputConfirmPassword;
