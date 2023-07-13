import PropTypes from "prop-types";
import "@components/spinner/Spinner.scss";

const Spinner = ({ bgColor }) => {
	return (
		<>
			<div className="spinner">
				<div className="dot1" style={{ backgroundColor: `${bgColor}` }}></div>
				<div className="dot2" style={{ backgroundColor: `${bgColor}` }}></div>
				<div className="dot3" style={{ backgroundColor: `${bgColor}` }}></div>
			</div>
		</>
	);
};
Spinner.propTypes = {
	bgColor: PropTypes.string,
};

Spinner.defaultProps = {
	bgColor: "#50b5ff",
};
export default Spinner;
