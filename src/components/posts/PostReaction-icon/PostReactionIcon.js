import PropTypes from "prop-types";
import { FcBullish, FcBearish } from "react-icons/fc";
import { SlRocket } from "react-icons/sl";

import "@components/posts/PostReaction-icon/PostReactionIcon.scss";

function PostReactionIcon({ postReaction }) {
	const { rocket, bullish, bearish, reactionsCount } = postReaction;

	return (
		<div className="post-reaction-icon">
			{Boolean(rocket) && <SlRocket className="icon" />}
			{Boolean(bullish) && <FcBullish className="icon" />}
			{Boolean(bearish) && <FcBearish className="icon" />}
			<p>{rocket || bullish || bearish ? reactionsCount : null}</p>
		</div>
	);
}

PostReactionIcon.propTypes = {
	postReaction: PropTypes.object,
};

export default PostReactionIcon;
