import React from "react";
import PropTypes from "prop-types";

import "@components/input/Input.scss";

function Input({
	id,
	name,
	type,
	value,
	style,
	className,
	text,
	placeholder,
	onChange,
	onBlur,
	autoComplete,
	onKeyPress,
	invalid,
	step,
	min,
	max,
	disabled,
}) {
	return (
		<>
			<div className={`form-row ${className}`}>
				{text && (
					<label htmlFor={name} className="form-label">
						{text}
					</label>
				)}
				<input
					id={id}
					name={name}
					type={type}
					value={value}
					style={style}
					onChange={onChange}
					onBlur={onBlur}
					placeholder={placeholder}
					className={`form-input ${invalid ? "input-invalid" : ""} ${
						disabled ? "input-disabled" : ""
					}`}
					autoComplete={autoComplete}
					onKeyPress={onKeyPress}
					step={step}
					min={min}
					max={max}
					disabled={disabled}
				></input>
			</div>
		</>
	);
}

Input.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	value: PropTypes.string,
	className: PropTypes.string,
	text: PropTypes.string,
	style: PropTypes.object,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	onKeyPress: PropTypes.func,
	autoComplete: PropTypes.string,
	invalid: PropTypes.bool,
	step: PropTypes.string,
	min: PropTypes.string,
	max: PropTypes.string,
	disabled: PropTypes.bool,
};

Input.defaultProps = {
	onChange: () => {},
	onBlur: () => {},
	onKeyPress: () => {},
	autoComplete: "off",
	invalid: false,
	disabled: false,
};

export default Input;
