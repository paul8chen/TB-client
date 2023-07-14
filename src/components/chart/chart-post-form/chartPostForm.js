// import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import html2canvas from "html2canvas";
import domtoimage from "dom-to-image";

// import Button from "@components/button/Button";
// import { clearCurrent } from "@store/reducers/chartPanelReducer";
import "@components/chart/chart-post-form/chartPostForm.scss";
import TextAreaInput from "@components/textAreaInput/TextAreaInput";
import { postService } from "@services/api/post.service";

function ChartPostForm() {
	// console.log("render chart-postForm");
	const { filteredStockData } = useSelector((state) => state.chart);
	const { profilePicture } = useSelector((state) => state.user.profile);
	const [postFormAlert, setPostFormAlert] = useState("");
	// const dispatch = useDispatch();
	// const { editId } = useSelector((state) => state.chartPanel);

	useEffect(() => {
		if (!postFormAlert) return;
		const postFormAlertTimer = setTimeout(() => {
			setPostFormAlert("");
		}, process.env.REACT_APP_INVALID_INPUT_DURATION_MS);

		return () => {
			clearTimeout(postFormAlertTimer);
		};
	}, [postFormAlert]);

	const postSubmitHandler = async (post) => {
		if (!filteredStockData.length) return setPostFormAlert("invalid");

		const chartEl = document.querySelector(".candle-stick-chart");
		const image = await domtoimage.toPng(chartEl);

		const data = {
			post,
			profilePicture,
			image,
		};

		const response = await postService.createPost(data);
		const { message } = await response.json();
		setPostFormAlert(message);
	};

	return (
		<div className="chart-panel-body-post">
			<div className="chart-panel-body-post-text">
				<p className="chart-panel-body-post-text-title"></p>Publish Chart on
				Post
				{postFormAlert === "invalid" && (
					<p className="chart-panel-body-post-text-invalid">
						No result was found on chart. Please try again!
					</p>
				)}
				{postFormAlert !== "invalid" && (
					<p className="chart-panel-body-post-text-message">{postFormAlert}</p>
				)}
			</div>
			<TextAreaInput
				onSubmit={postSubmitHandler}
				emojiPickerStyle={{
					position: "fixed",
					left: "77%",
					top: "47%",
				}}
			/>
		</div>
	);
}

ChartPostForm.propTypes = {};

export default ChartPostForm;
