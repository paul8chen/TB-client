import React from "react";
import PropTypes from "prop-types";

import "@components/input/Input.scss";

function Input({
	id,
	name,
	type,
	value,
	className,
	text,
	placeholder,
	onChange,
	onBlur,
	autoComplete,
}) {
	return (
		<>
			<div className="form-row">
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
					onChange={onChange}
					onBlur={onBlur}
					placeholder={placeholder}
					className={`form-input ${className}`}
					autoComplete={autoComplete}
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
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	autoComplete: PropTypes.string,
};

Input.defaultProps = {
	onChange: () => {},
	onBlur: () => {},
	autoComplete: "off",
};

export default Input;
