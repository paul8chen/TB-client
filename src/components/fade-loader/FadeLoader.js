import PropTypes from "prop-types";
import Loader from "react-spinners/FadeLoader";

const override = {
	display: "block",
	margin: "0 auto",
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
