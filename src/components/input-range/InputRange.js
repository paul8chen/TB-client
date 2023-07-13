import React from "react";
import PropTypes from "prop-types";

import "@components/input-range/InputRange.scss";

function InputRange({
	id,
	name,
	value,
	className,
	text,
	onChange,
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
					type="range"
					value={value}
					style={{ backgroundSize: `${+value * 100}% 100%` }}
					onChange={onChange}
					step={step}
					min={min}
					max={max}
					className={`form-range ${disabled ? "input-disabled" : ""}`}
					disabled={disabled}
				></input>
			</div>
		</>
	);
}

InputRange.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string,
	className: PropTypes.string,
	text: PropTypes.string,
	onChange: PropTypes.func,
	step: PropTypes.string,
	min: PropTypes.string,
	max: PropTypes.string,
	disabled: PropTypes.bool,
};

InputRange.defaultProps = {
	onChange: () => {},
	disabled: false,
};

export default InputRange;
