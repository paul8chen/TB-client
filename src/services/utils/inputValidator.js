class InputValidator {
	usernameMessage;
	emailMessage;
	passwordMessage;

	usernameValidator(username) {
		return this.validator("username", username, 6, /[^A-Za-z0-9_]/);
	}

	emailValidator = (email) => {
		return this.validator("email", email, 1, /^@ | @$|^((?!(@)).)*$/);
	};

	passwordValidator = (password) => {
		return this.validator("password", password, 6, /""/);
	};

	validator(field, input, requiredLength, regex) {
		const checkLength = this.checkLength(field, input, requiredLength);
		const checkInvalid = this.checkInvalid(field, input, regex);

		return checkLength && !checkInvalid;
	}

	checkLength(field, input, requiredLength) {
		const checkLength = input.length >= requiredLength;
		this[`${field}Message`] = checkLength
			? null
			: `A ${field} must required ${requiredLength} character at least.`;

		return checkLength;
	}

	checkInvalid(field, input, regex) {
		const checkInvalid = regex.test(input);
		this[`${field}Message`] = !checkInvalid
			? this[`${field}Message`]
			: `Not a valid ${field}, Please try again.`;

		return checkInvalid;
	}
}

export const inputValidator = new InputValidator();
