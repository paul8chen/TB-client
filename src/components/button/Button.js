import React from "react";
import PropTypes from "prop-types";

import "@components/button/Button.scss";

function Button({ className, disabled, onClick, name, value, children }) {
	return (
		<>
			<button
				type="submit"
				className={`button ${className}`}
				onClick={onClick}
				disabled={disabled}
				name={name}
				value={value}
			>
				{children}
			</button>
		</>
	);
}

Button.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
	name: PropTypes.string,
	value: PropTypes.string,
	children: PropTypes.any,
};

Button.defaultProps = {
	disabled: false,
	onClick: () => {},
};

export default Button;
