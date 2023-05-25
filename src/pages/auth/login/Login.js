import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import "./Login.scss";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";

const Login = () => {
	return (
		<div className="auth-inner">
			<div className="alerts " role="alert">
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
					{/* <label className="checkmark-container" htmlFor="checkbox">
						<Input
							id="checkbox"
							type="checkbox"
							name="checkbox"
							value={false}
							onChange={() => {}}
						/>
						Keep me signed in
					</label> */}
				</div>
				<Button
					text={"LOGIN"}
					className="auth-button"
					disabled={false}
					onClick={() => {}}
				></Button>
				<Link to="/forgot-password">
					<span className="button forgot-password">
						Forgot password?
						<FaArrowRight className="arrow-right"></FaArrowRight>
					</span>
				</Link>
			</form>
		</div>
	);
};

export default Login;
