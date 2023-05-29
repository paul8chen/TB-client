import React from "react";
import PropTypes from "prop-types";

function Button({ text, className, disabled, onClick, name, value }) {
	return (
		<>
			<button
				type="submit"
				className={className}
				onClick={onClick}
				disabled={disabled}
				name={name}
				value={value}
			>
				{text}
			</button>
		</>
	);
}

Button.propTypes = {
	text: PropTypes.string.isRequired,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
	name: PropTypes.string,
	value: PropTypes.string,
};

Button.defaultProps = {
	disabled: false,
	onClick: () => {},
};

export default Button;
