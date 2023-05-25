import "./Signup.scss";

import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";

const Signup = () => {
	return (
		<div className="auth-inner">
			<div className="alerts alert-error" role="alert">
				Error message
			</div>
			<form className="auth-form">
				<div className="form-input-container">
					<Input
						id="username"
						name="username"
						type="text"
						value="my value"
						text="Username"
						placeholder="Enter Username"
					></Input>
					<Input
						id="password"
						name="password"
						type="password"
						value="my value"
						text="Password"
						placeholder="Enter Password"
					></Input>
					<Input
						id="email"
						name="email"
						type="email"
						value="my value"
						text="Email"
						placeholder="Enter EMail"
					></Input>
				</div>
				<Button
					text={"SIGN UP"}
					className="button auth-button"
					disabled={true}
					onClick={() => {}}
				></Button>
			</form>
		</div>
	);
};

export default Signup;
