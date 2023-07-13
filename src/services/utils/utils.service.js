import { floor, random } from "lodash";

import { avatarColors } from "@services/utils/static.data";
import { addUser, removeUser } from "@store/reducers/userReducer";

export class Utils {
	static avatarColor() {
		return avatarColors[floor(random(0.9) * avatarColors.length)];
	}

	static generateAvatar(text, backgroundColor, foregroundColor = "white") {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");

		canvas.width = 200;
		canvas.height = 200;

		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		// Draw text
		context.font = "normal 80px sans-serif";
		context.fillStyle = foregroundColor;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText(text, canvas.width / 2, canvas.height / 2);

		return canvas.toDataURL("image/png");
	}

	static saveUserStorage(result, setUsernameLocal, setUIdLocal, dispatch) {
		const { token, user: profile } = result;
		console.log("💥profile💥", profile);
		setUsernameLocal(profile.username);
		setUIdLocal(profile.uId);
		dispatch(addUser({ token, profile }));
	}

	static clearUserStorage(deleteUsernameLocal, dispatch) {
		deleteUsernameLocal();
		dispatch(removeUser());
	}

	static getISOStringDate(timestamp) {
		return new Date(timestamp).toISOString().substring(0, 10);
	}

	static firstLetterUpperCase(string) {
		return string.slice(0, 1).toUpperCase() + string.slice(1);
	}

	static getStringFirstCharacterLowerCase = (string) =>
		string.split(" ")[0].toLowerCase();
}
