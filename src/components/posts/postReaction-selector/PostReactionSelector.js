import PropTypes from "prop-types";
import { useEffect, useState, forwardRef } from "react";
import { FcBullish, FcBearish } from "react-icons/fc";
import { SlRocket } from "react-icons/sl";

import "@components/posts/postReaction-selector/PostReactionSelector.scss";

const PostReactionSelector = forwardRef(({ onClick }, ref) => {
	const reactionItems = [
		{
			dataReaction: "rocket",
			dataInfo: "to the moon",
			component: <SlRocket className="icon-bg" />,
		},
		{
			dataReaction: "bullish",
			dataInfo: "bullish",
			component: <FcBullish className="icon-bg" />,
		},
		{
			dataReaction: "bearish",
			dataInfo: "bearish",
			component: <FcBearish className="icon-bg" />,
		},
	];

	const [iconInfo, setIconInfo] = useState();

	useEffect(() => {
		const iconMouseEnterHandler = (event) => {
			const enteredReaction = event.target.closest(".reaction-select-item");
			if (!enteredReaction) return;

			setIconInfo(enteredReaction.dataset.info);
			enteredReaction.classList.add("active");
		};
		const iconMouseLeaveHandler = (event) => {
			const leaveReaction = event.target.closest(".reaction-select-item");
			if (!leaveReaction) return;
			if (!event.target.classList.contains("reaction-select-item")) return;

			leaveReaction.classList.remove("active");
			setIconInfo();
		};

		const el = ref.current;
		if (!el) return;

		el.addEventListener("mouseenter", iconMouseEnterHandler, {
			capture: true,
		});
		el.addEventListener("mouseleave", iconMouseLeaveHandler, {
			capture: true,
		});

		return () => {
			el.removeEventListener("mouseenter", iconMouseEnterHandler);
			el.removeEventListener("mouseleave", iconMouseLeaveHandler);
		};
	}, [ref]);

	return (
		<div className="reaction-select" ref={ref} onClick={onClick}>
			{reactionItems.map((item) => (
				<div
					key={item.dataReaction}
					className="reaction-select-item"
					data-reaction={item.dataReaction}
					data-info={item.dataInfo}
				>
					{item.component}
					{iconInfo && <p>{iconInfo}</p>}
				</div>
			))}
		</div>
	);
});

PostReactionSelector.propTypes = {
	onClick: PropTypes.func,
};

export default PostReactionSelector;
