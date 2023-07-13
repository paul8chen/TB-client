import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiCross } from "react-icons/bi";

import Button from "@components/button/Button";
import Input from "@components/input/Input";
import Select from "@components/select/Select";
import { ChartUtils } from "@services/utils/chart.utils";
import {
	setBreakRatio,
	setColor,
	setAbove,
	clearCurrent,
	setValue,
	setDate,
} from "@store/reducers/chartPanelReducer";
import { Utils } from "@services/utils/utils.service";
import {
	addIndicator,
	updateIndicator,
	toggleChartClickable,
} from "@store/reducers/chartReducer";
import { stockService } from "@services/api/stock.service";

function ChartPriceForm({ editId, isActive }) {
	// console.log("render chart-priceForm");
	const dispatch = useDispatch();
	const { chartClickable, tickId } = useSelector((state) => state.chart);
	const {
		value: price,
		date,
		breakRatio,
		isAbove,
		color,
		stockData,
		chartData,
	} = useSelector((state) => state.chartPanel[state.chartPanel.current]);

	const [enteredPrice, setEnteredPrice] = useState("" + price);
	const [enteredBreakRatio, setEnteredBreakRatio] = useState("" + breakRatio);
	const [breakRatioLock, setBreakRatioLock] = useState(false);
	const [breakRatioDisabled, setBreakRatioDisabled] = useState(false);
	const [enteredColor, setEnteredColor] = useState(color);
	const [selectedDate, setSelectedDate] = useState(
		Utils.getISOStringDate(date)
	);

	const [invalidInput, setInvalidInput] = useState("");

	useEffect(() => {
		if (isActive) return;
		setBreakRatioLock(false);
	}, [isActive]);

	useEffect(() => {
		setEnteredPrice("" + price);
	}, [price]);

	useEffect(() => {
		setSelectedDate(Utils.getISOStringDate(date));
	}, [date]);

	useEffect(() => {
		setEnteredBreakRatio("" + breakRatio);
	}, [breakRatio]);

	useEffect(() => {
		setEnteredColor(color);
	}, [color]);

	useEffect(() => {
		if (!invalidInput) return;

		const setInvalidInputTimer = setTimeout(() => {
			setInvalidInput("");
		}, +process.env.REACT_APP_INVALID_INPUT_DURATION_MS);

		return () => {
			clearTimeout(setInvalidInputTimer);
		};
	}, [invalidInput]);

	useEffect(() => {
		const setColorTimer = setTimeout(() => {
			dispatch(setColor({ color: enteredColor }));
		}, process.env.REACT_APP_INPUT_CHANGE_DURATION_MS);

		return () => {
			clearTimeout(setColorTimer);
		};
	}, [enteredColor, dispatch]);

	useEffect(() => {
		if (breakRatioLock) return;

		const setBreakRatioTimeout = setTimeout(() => {
			dispatch(setBreakRatio({ breakRatio: +enteredBreakRatio }));
			setBreakRatioLock(true);
		}, process.env.REACT_APP_SEND_REQUEST_DURATION_MS);

		return () => {
			clearTimeout(setBreakRatioTimeout);
		};
	}, [enteredBreakRatio, dispatch, breakRatioLock]);

	const priceChangeHandler = (event) => {
		setEnteredPrice(event.target.value);
	};

	const priceBlurHandler = (event) => {
		const { value } = event.target;
		const { maxY, minY } = ChartUtils.getAxisLimit();

		if (+value > minY && +value < maxY)
			return dispatch(setValue({ value: +value }));

		setEnteredPrice("" + price);
		setInvalidInput("PRICE");
	};

	const pricePressHandler = (event) => {
		if (event.key !== "Enter") return;
		event.preventDefault();
		event.target.blur();
	};

	const dateChangeHandler = (event) => {
		const { value } = event.target;
		setSelectedDate(value);
		const { maxX, minX } = ChartUtils.getAxisLimit();

		if (new Date(value) > minX && new Date(value) < maxX) {
			const chartDate = ChartUtils.converDateToChartDate(value);
			return dispatch(setDate({ date: chartDate }));
		}

		new Date(value) <= minX && setSelectedDate(Utils.getISOStringDate(minX));
		new Date(value) >= maxX && setSelectedDate(Utils.getISOStringDate(maxX));
		setInvalidInput("DATE");
	};

	const breakRatioChangeHandler = (event) => {
		const { value } = event.target;
		setEnteredBreakRatio(value);

		if (+value >= 0 && +value <= 1 && value !== "") {
			console.log("PASS");
			setEnteredBreakRatio(value);
			setBreakRatioLock(false);
			return;
		}

		+value < 0 && setEnteredBreakRatio("0");
		+value > 1 && setEnteredBreakRatio("1");
		value === "" && setEnteredBreakRatio("0.5");
		setInvalidInput("BREAK_RATIO");
	};

	const colorChangeHandler = (event) => {
		const { value } = event.target;
		setEnteredColor(value);
	};

	const candlestickPositionChangeHandler = (event) => {
		const { value } = event.target;
		const isAbove = value === "above";

		isAbove && setBreakRatioDisabled(true);
		!isAbove && setBreakRatioDisabled(false);

		dispatch(setAbove({ isAbove }));
	};

	const selectOnChartClickHandler = () => {
		dispatch(toggleChartClickable());
	};

	const setPriceBtnClickHandler = async (event) => {
		event.preventDefault();

		if (!price) return setInvalidInput("PRICE");

		const indicatorDataToDB = {
			price,
			date,
			color,
			breakRatio,
			isAbove,
		};

		const indicatorData = {
			...chartData,
			stockData,
			indicatorValue: [price],
			breakRatio,
			isAbove,
		};

		if (!editId) {
			dispatch(
				addIndicator({
					indicatorData: { id: "" + +new Date(), ...indicatorData },
				})
			);

			indicatorDataToDB.TickId = tickId;
			indicatorDataToDB.indicatorType = "price";
			stockService.addIndicator("price", indicatorDataToDB);
		}

		if (editId) {
			dispatch(
				updateIndicator({ id: editId, updatedIndicatorData: indicatorData })
			);

			indicatorDataToDB.id = editId;
			stockService.updateIndicator("price", indicatorDataToDB);
		}

		dispatch(clearCurrent());
	};

	const cancelUpdateBtnClickHandler = async (event) => {
		event.preventDefault();

		dispatch(clearCurrent());
	};

	return (
		<div className="chart-panel-body-indicator">
			<div className="chart-panel-body-price-with-input-btn">
				<Input
					id="price"
					type="text"
					name="price"
					text="Price"
					value={enteredPrice}
					className="chart-panel-body-input"
					onBlur={priceBlurHandler}
					onChange={priceChangeHandler}
					onKeyPress={pricePressHandler}
					invalid={invalidInput === "PRICE"}
				/>
				<div
					className={`chart-panel-body-input-btn ${
						chartClickable ? "active" : ""
					}`}
					onClick={selectOnChartClickHandler}
				>
					<BiCross className="icon" />
					<p>Select on Chart</p>
				</div>
			</div>

			<Input
				id="date"
				type="date"
				name="date"
				text="Date"
				value={selectedDate}
				className="chart-panel-body-input"
				onChange={dateChangeHandler}
				invalid={invalidInput === "DATE"}
			/>
			<Input
				id="break-ratio"
				type="number"
				name="break-ratio"
				text="Break Ratio"
				step={"0.05"}
				value={enteredBreakRatio}
				onChange={breakRatioChangeHandler}
				className="chart-panel-body-input"
				invalid={invalidInput === "BREAK_RATIO"}
				disabled={breakRatioDisabled}
			/>
			<Input
				id="color"
				type="color"
				name="color"
				text="Color"
				value={enteredColor}
				className="chart-panel-body-input"
				onChange={colorChangeHandler}
			/>
			<Select
				className="chart-panel-body-select"
				name="candlestick-position"
				id="candlestick-position"
				text="Candlestick Position"
				value={isAbove ? "above" : "break"}
				options={["Break Through", "Above"]}
				onChange={candlestickPositionChangeHandler}
			/>

			{!editId && (
				<Button className="chart-button" onClick={setPriceBtnClickHandler}>
					Add Price
				</Button>
			)}
			{editId && (
				<div className="update-price-button-wrapper">
					<Button
						className="chart-button chart-button-edit"
						onClick={setPriceBtnClickHandler}
					>
						Update Price
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

ChartPriceForm.propTypes = {
	editId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	isActive: PropTypes.bool,
};

export default ChartPriceForm;
