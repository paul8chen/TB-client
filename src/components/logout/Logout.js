import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import "@components/logout/Logout.scss";
import Button from "@components/button/Button";
import { Utils } from "@services/utils/utils.service";
import useLocalStorage from "@hooks/useLocalStorage";
import { authService } from "@services/api/auth.service";

const Logout = () => {
	const dispatch = useDispatch();
	const [deleteLocalStorage] = useLocalStorage("username");
	const navigate = useNavigate();

	const buttonClickHandler = async (event) => {
		event.preventDefault();

		try {
			navigate("/");
			await authService.logout();
			Utils.clearUserStorage(deleteLocalStorage, dispatch);
		} catch (err) {
			console.log("logout error", err);
		}
	};

	return (
		<div className="logout-container">
			<Button
				value="logout"
				name="logout"
				className="button logout-button"
				onClick={buttonClickHandler}
			>
				Logout
			</Button>
		</div>
	);
};

export default Logout;
