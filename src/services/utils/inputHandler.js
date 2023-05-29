export class InputHandler {
	constructor(input, setInput, setInputIsValid, setIsClicked, validator) {
		this.input = input;
		this.setInput = setInput;
		this.setInputIsValid = setInputIsValid;
		this.setIsClicked = setIsClicked;
		this.validator = validator;
	}

	changeHandler = (event) => {
		const inputUsername = event.target.value;

		this.setInput(inputUsername);
		this.setInputIsValid(this.validator(inputUsername));
	};

	blurHandler = () => {
		this.setIsClicked(true);
		this.setInputIsValid(this.validator(this.input));
	};
}
