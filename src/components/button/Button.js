import React from "react";
import PropTypes from "prop-types";

function Button({ text, className, disabled, onClick }) {
	return (
		<>
			<button className={className} onClick={onClick} disabled={disabled}>
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
};

export default Button;
