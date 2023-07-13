import PropTypes from "prop-types";

import "@components/select/Select.scss";
import { Utils } from "@services/utils/utils.service";

function Select({
	className,
	name,
	id,
	text,
	options,
	onChange,
	value,
	disabled,
}) {
	return (
		<div className={`form-select ${className}`}>
			<label htmlFor={id} className="form-select-label">
				{text}
			</label>
			<select
				name={name}
				id={id}
				className="form-select-input"
				onChange={onChange}
				value={value}
				disabled={disabled}
			>
				{!disabled &&
					options.map((opt) => (
						<option
							value={Utils.getStringFirstCharacterLowerCase(opt)}
							key={Utils.getStringFirstCharacterLowerCase(opt)}
						>
							{opt}
						</option>
					))}
			</select>
		</div>
	);
}

Select.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string,
	id: PropTypes.string,
	text: PropTypes.string,
	options: PropTypes.array,
	onChange: PropTypes.func,
	value: PropTypes.string,
	disabled: PropTypes.bool,
};

Select.defaultProps = {
	onChange: () => {},
	disabled: false,
};

export default Select;
