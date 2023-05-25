import React from "react";
import PropTypes from "prop-types";

import "./Input.scss";

function Input({
	id,
	name,
	type,
	value,
	className,
	text,
	placeholder,
	onChange,
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
					placeholder={placeholder}
					className={`form-input ${className}`}
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
};

export default Input;
