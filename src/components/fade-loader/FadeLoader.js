import PropTypes from "prop-types";
import Loader from "react-spinners/FadeLoader";

const override = {
	position: "absolute",
	top: "50%",
	left: "50%",
	margin: "auto",
};

const rootStyleEl = getComputedStyle(document.documentElement);
const PRIMARY_COLOR = rootStyleEl.getPropertyValue("--primary-1");

function FadeLoader({ loading, color, size }) {
	return (
		<Loader
			color={color}
			loading={loading}
			cssOverride={override}
			size={size}
		/>
	);
}

FadeLoader.propTypes = {
	loading: PropTypes.bool,
	color: PropTypes.string,
	size: PropTypes.number,
};

FadeLoader.defaultProps = {
	loading: false,
	color: PRIMARY_COLOR,
	size: 150,
};

export default FadeLoader;
