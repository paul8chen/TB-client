import React, { useState } from "react";
import PropTypes from "prop-types";

import "@components/input-validator/InputValidator.scss";
import Input from "@components/input/Input";
import { inputValidator } from "@services/utils/inputValidator";

function InputValidator({ id, name, type, text, placeholder, autoComplete }) {
	const [input, setInput] = useState("");
	const [inputIsValid, setinputIsValid] = useState(false);
	const [inputIsClicked, setinputIsClicked] = useState(false);

	const changeHandler = (event) => {
		const enteredInput = event.target.value;

		setInput(enteredInput);
		setinputIsValid(inputValidator[`${name}Validator`](enteredInput));
	};

	const blurHandler = () => {
		setinputIsClicked(true);
		setinputIsValid(inputValidator[`${name}Validator`](input));
	};

	return (
		<>
			<Input
				id={id}
				name={name}
				type={type}
				value={input}
				text={text}
				className={inputIsClicked && !inputIsValid ? "input-invalid" : ""}
				placeholder={placeholder}
				autoComplete={autoComplete}
				onChange={changeHandler}
				onBlur={blurHandler}
			></Input>
			{inputIsClicked && !inputIsValid ? (
				<p className="invalid">{inputValidator[`${name}Message`]}</p>
			) : null}
		</>
	);
}

InputValidator.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	value: PropTypes.string,
	text: PropTypes.string,
	placeholder: PropTypes.string,
	autoComplete: PropTypes.string,
	validator: PropTypes.func,
};

InputValidator.defaultProps = {
	autoComplete: "off",
};

export default InputValidator;
