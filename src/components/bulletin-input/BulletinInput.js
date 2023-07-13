import PropTypes from "prop-types";
import { forwardRef, useState } from "react";

import "@components/bulletin-input/BulletinInput.scss";

const BulletinInput = forwardRef(({ onSubmit }, ref) => {
	const [itemText, setItemText] = useState("");

	const textChangeHandler = (event) => {
		setItemText(event.target.value);
	};

	return (
		<div className="bulletin-input">
			<div className="input-name">
				<form onSubmit={onSubmit}>
					<input
						ref={ref}
						type="text"
						value={itemText}
						className="text"
						onChange={textChangeHandler}
					></input>
				</form>
			</div>
		</div>
	);
});

BulletinInput.propTypes = {
	onSubmit: PropTypes.func,
	isAddClicked: PropTypes.bool,
};

BulletinInput.defaultProps = {
	isAddClicked: false,
};
export default BulletinInput;
