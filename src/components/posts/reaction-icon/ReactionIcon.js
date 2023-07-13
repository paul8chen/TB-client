import PropTypes from "prop-types";
import { FcBullish, FcBearish } from "react-icons/fc";
import { SlRocket } from "react-icons/sl";

import "@components/posts/reaction-icon/ReactionIcon.scss";

function ReactionIcon({ currentReaction }) {
	return (
		<>
			{currentReaction === "rocket" && <SlRocket className="icon fill" />}
			{currentReaction === "bullish" && <FcBullish className="icon" />}
			{currentReaction === "bearish" && <FcBearish className="icon" />}
			{!currentReaction && <SlRocket className="icon" />}
		</>
	);
}

ReactionIcon.propTypes = {
	currentReaction: PropTypes.string,
};

export default ReactionIcon;
