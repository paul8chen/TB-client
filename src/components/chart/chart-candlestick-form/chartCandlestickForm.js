import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiForbid2Line } from "react-icons/ri";

import "@components/chart/chart-candlestick-form/chartCandlestickForm.scss";
import CandlestickCanvas from "@components/chart/chart-candlestick-form/CandlestickCanvas";
import Button from "@components/button/Button";
import InputRange from "@components/input-range/InputRange";
import Select from "@components/select/Select";
import {
	clearCurrent,
	setCandlestickType,
	setShadow,
	setValue,
} from "@store/reducers/chartPanelReducer";
import { addIndicator, updateIndicator } from "@store/reducers/chartReducer";
import { stockService } from "@services/api/stock.service";

const candlestickTypeOptions = [
	"Bullish Candlestick",
	"Bearish Candlestick",
	"Doji Candlestick",
];

function ChartCandlestickForm({ editId, isActive }) {
	// console.log("render chart-maForm");
	const dispatch = useDispatch();
	const { tickId } = useSelector((state) => state.chart);
	const {
		value: bodyRatio,
		upperShadow,
		lowerShadow,
		candlestickType,
		stockData,
		chartData,
	} = useSelector((state) => state.chartPanel[state.chartPanel.current]);

	const [enteredBodyRatio, setEnteredBodyRatio] = useState("" + bodyRatio);
	const [enteredUpperShadow, setEnteredUpperShadow] = useState(
		"" + upperShadow
	);
	const [enteredLowerShadow, setEnteredLowerShadow] = useState(
		"" + upperShadow
	);
	const [isUpperShadowLock, setIsUpperShadowLock] = useState(true);
	const [isSetRatioLock, setIsSetRatioLock] = useState(true);
	const [isBodyDisabledClicked, setIsBodyDisabledClicked] = useState(
		!bodyRatio
	);
	const [isShadowDisabledClicked, setIsShadowDisabledClicked] = useState(
		!upperShadow
	);
	const [isShadowDisabledClickedLock, setIsShadowDisabledClickedLock] =
		useState(true);
	const [isBodyDisabledClickedLock, setIsBodyDisabledClickedLock] =
		useState(true);
	const [
		isCandlestickTypeDisabledClicked,
		setIsCandlestickTypeDisabledClicked,
	] = useState(!candlestickType);

	useEffect(() => {
		if (isActive) return;
		setIsBodyDisabledClicked(false);
		setIsShadowDisabledClicked(false);
		setIsCandlestickTypeDisabledClicked(false);
	}, [isActive]);

	useEffect(() => {
		setEnteredBodyRatio("" + bodyRatio);
		setIsBodyDisabledClicked(!bodyRatio);
	}, [bodyRatio]);

	useEffect(() => {
		setEnteredUpperShadow("" + upperShadow);
		setIsShadowDisabledClicked(!upperShadow);
	}, [upperShadow]);

	useEffect(() => {
		setEnteredLowerShadow("" + lowerShadow);
	}, [lowerShadow]);

	useEffect(() => {
		if (isShadowDisabledClickedLock) return;

		dispatch(
			setShadow({
				upperShadow: isShadowDisabledClicked ? "" : enteredUpperShadow,
				lowerShadow: isShadowDisabledClicked ? "" : enteredLowerShadow,
			})
		);
		setIsShadowDisabledClickedLock(true);
	}, [
		dispatch,
		isShadowDisabledClicked,
		enteredUpperShadow,
		enteredLowerShadow,
		isShadowDisabledClickedLock,
	]);

	useEffect(() => {
		if (isBodyDisabledClickedLock) return;

		dispatch(
			setValue({
				value: isBodyDisabledClicked ? "" : 0.5,
			})
		);
		dispatch(
			setShadow({
				upperShadow: isBodyDisabledClicked ? "" : 0.25,
				lowerShadow: isBodyDisabledClicked ? "" : 0.25,
			})
		);
	}, [dispatch, isBodyDisabledClicked, isBodyDisabledClickedLock]);

	useEffect(() => {
		if (isBodyDisabledClicked) return;
		if (isShadowDisabledClicked) {
			const remainRatio = ((1 - enteredBodyRatio) / 2).toFixed(2);
			setEnteredLowerShadow(remainRatio);
			setEnteredUpperShadow(remainRatio);
			return;
		}

		if (isUpperShadowLock) return;

		const remainRatio = (1 - enteredBodyRatio - enteredUpperShadow).toFixed(2);
		if (remainRatio > 0) {
			setEnteredLowerShadow(remainRatio);
		} else {
			setEnteredUpperShadow((1 - enteredBodyRatio).toFixed(2));
			setEnteredLowerShadow("0");
		}
		setIsUpperShadowLock(true);
	}, [
		enteredBodyRatio,
		enteredUpperShadow,
		enteredLowerShadow,
		isUpperShadowLock,
		isShadowDisabledClicked,
		isBodyDisabledClicked,
	]);

	useEffect(() => {
		if (isSetRatioLock) return;

		const setRatioTimeout = setTimeout(() => {
			dispatch(setValue({ value: +enteredBodyRatio }));
			!isShadowDisabledClicked &&
				dispatch(
					setShadow({
						upperShadow: +enteredUpperShadow,
						lowerShadow: +enteredLowerShadow,
					})
				);
			setIsSetRatioLock(true);
		}, +process.env.REACT_APP_SEND_REQUEST_DURATION_MS);

		return () => {
			clearTimeout(setRatioTimeout);
		};
	}, [
		dispatch,
		isSetRatioLock,
		enteredBodyRatio,
		enteredUpperShadow,
		enteredLowerShadow,
		isShadowDisabledClicked,
	]);

	const bodyRatioChangeHandler = (event) => {
		const { value } = event.target;

		if (isShadowDisabledClicked && +value < 0.05)
			return setEnteredBodyRatio("0.05");

		setEnteredBodyRatio(value);
		setIsUpperShadowLock(false);
		setIsSetRatioLock(false);

		if (!+value) {
			return dispatch(setCandlestickType({ candlestickType: "doji" }));
		}

		if (candlestickType === "doji")
			dispatch(setCandlestickType({ candlestickType: "bullish" }));
	};

	const upperShadowChangeHandler = (event) => {
		const { value } = event.target;
		setEnteredUpperShadow(value);
		setIsUpperShadowLock(false);
		setIsSetRatioLock(false);
	};

	const candlestickTypeChangeHandler = (event) => {
		const { value: candlestickType } = event.target;

		dispatch(setCandlestickType({ candlestickType }));

		if (isBodyDisabledClicked) return;

		if (+enteredBodyRatio === 0) {
			setIsUpperShadowLock(false);
			setEnteredBodyRatio("0.05");
		}

		if (candlestickType !== "doji") return;
		setIsUpperShadowLock(false);
		setEnteredBodyRatio("0");
	};

	const setCandlestickBtnClickHandler = async (event) => {
		event.preventDefault();

		const indicatorDataToDB = {
			bodyRatio,
			upperShadow,
			lowerShadow,
			candlestickType,
		};

		const indicatorData = {
			...chartData,
			stockData,
			indicatorValue: [bodyRatio, upperShadow, lowerShadow, candlestickType],
			upperShadow,
			lowerShadow,
			candlestickType,
		};

		if (!editId) {
			dispatch(
				addIndicator({
					indicatorData: { id: "" + +new Date(), ...indicatorData },
				})
			);

			indicatorDataToDB.TickId = tickId;
			indicatorDataToDB.indicatorType = "candlestick";
			stockService.addIndicator("candlestick", indicatorDataToDB);
		}

		if (editId) {
			dispatch(
				updateIndicator({ id: editId, updatedIndicatorData: indicatorData })
			);

			indicatorDataToDB.id = editId;
			stockService.updateIndicator("candlestick", indicatorDataToDB);
		}

		dispatch(clearCurrent());
	};

	const cancelUpdateBtnClickHandler = async (event) => {
		event.preventDefault();

		dispatch(clearCurrent());
	};

	const disableBodyRatioClickHandler = (event) => {
		setIsBodyDisabledClicked((state) => !state);

		const isClicked = event.target
			.closest(".chart-panel-body-input-btn")
			.classList.contains("active");

		setIsShadowDisabledClicked(!isClicked);
		setIsBodyDisabledClickedLock(false);
	};

	const disableShadowRatioClickHandler = () => {
		setIsShadowDisabledClicked((state) => !state);
		setIsShadowDisabledClickedLock(false);
	};

	const disableCandleStickTypeClickHandler = (event) => {
		setIsCandlestickTypeDisabledClicked((state) => !state);

		!event.target
			.closest(".chart-panel-body-input-btn")
			.classList.contains("active") &&
			dispatch(setCandlestickType({ candlestickType: "" }));
	};

	return (
		<div className="chart-panel-body-indicator">
			<div className="chart-panel-body-price-with-input-btn candlestick-ratio">
				<InputRange
					id="upperShadow"
					name="upperShadow"
					text={`Upper Shadow Ratio: ${
						!+enteredUpperShadow || +enteredUpperShadow === 1
							? (+enteredUpperShadow).toFixed(0)
							: enteredUpperShadow
					}`}
					value={enteredUpperShadow}
					min={"0"}
					max={"1"}
					step={"0.05"}
					className="chart-panel-body-input"
					onChange={upperShadowChangeHandler}
					disabled={isShadowDisabledClicked}
				/>
				<div
					className={`chart-panel-body-input-btn ${
						isShadowDisabledClicked ? "active" : ""
					}`}
					onClick={disableShadowRatioClickHandler}
				>
					<RiForbid2Line className="icon" />
					<p>Disable Shadow Ratio</p>
				</div>
			</div>
			<div className="chart-panel-body-price-with-input-btn candlestick-ratio">
				<InputRange
					id="body-ratio"
					name="body-ratio"
					text={`Body Ratio: ${enteredBodyRatio}`}
					min={"0"}
					max={"1"}
					step={"0.05"}
					value={enteredBodyRatio}
					onChange={bodyRatioChangeHandler}
					className="chart-panel-body-input"
					disabled={isBodyDisabledClicked}
				/>
				<div
					className={`chart-panel-body-input-btn ${
						isBodyDisabledClicked ? "active" : ""
					}`}
					onClick={disableBodyRatioClickHandler}
				>
					<RiForbid2Line className="icon" />
					<p>Disable Ratio</p>
				</div>
			</div>

			<InputRange
				id="lowerShadow"
				name="lowerShadow"
				text={`Lower Shadow Ratio: ${
					!+enteredLowerShadow || +enteredLowerShadow === 1
						? (+enteredLowerShadow).toFixed(0)
						: enteredLowerShadow
				}`}
				value={enteredLowerShadow}
				min={"0"}
				max={"1"}
				step={"0.05"}
				className="chart-panel-body-input candlestick-ratio"
				disabled={true}
			/>

			<div className="chart-panel-body-price-with-input-btn candlestick-ratio">
				<div className="chart-panel-body-select-with-canvas">
					<Select
						className="chart-panel-body-select"
						name="candlestick-type"
						id="candlestick-type"
						text="Candlestick Type"
						value={candlestickType}
						options={
							isShadowDisabledClicked && !isBodyDisabledClicked
								? candlestickTypeOptions.slice(0, -1)
								: candlestickTypeOptions
						}
						onChange={candlestickTypeChangeHandler}
						disabled={isCandlestickTypeDisabledClicked}
					/>
					<CandlestickCanvas
						className="candlestick-canvas"
						bodyRatio={+enteredBodyRatio}
						upperShadowRatio={+enteredUpperShadow}
						lowerShadowRatio={+enteredLowerShadow}
						candlestickType={candlestickType}
					/>
				</div>
				<div
					className={`chart-panel-body-input-btn ${
						isCandlestickTypeDisabledClicked ? "active" : ""
					}`}
					onClick={disableCandleStickTypeClickHandler}
				>
					<RiForbid2Line className="icon" />
					<p>Disable Candlestick Type</p>
				</div>
			</div>

			{!editId && (
				<Button
					className="chart-button"
					onClick={setCandlestickBtnClickHandler}
				>
					Add Candlestick
				</Button>
			)}
			{editId && (
				<div className="update-price-button-wrapper">
					<Button
						className="chart-button chart-button-edit"
						onClick={setCandlestickBtnClickHandler}
					>
						Update Candlestick
					</Button>
					<Button
						className="chart-button chart-button-cancel"
						onClick={cancelUpdateBtnClickHandler}
					>
						Cancel
					</Button>
				</div>
			)}
		</div>
	);
}

ChartCandlestickForm.propTypes = {
	editId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	isActive: PropTypes.bool,
};

export default ChartCandlestickForm;
