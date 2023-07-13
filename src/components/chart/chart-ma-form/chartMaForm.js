import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
	setMaBy,
} from "@store/reducers/chartPanelReducer";
import { addIndicator, updateIndicator } from "@store/reducers/chartReducer";
import useInputInvalid from "@hooks/useInputInvalid";
import { stockService } from "@services/api/stock.service";

function ChartMaForm({ editId, isActive }) {
	// console.log("render chart-maForm");
	const dispatch = useDispatch();
	const { tickId } = useSelector((state) => state.chart);
	const {
		value: ma,
		maBy,
		breakRatio,
		isAbove,
		color,
		stockData,
		chartData,
	} = useSelector((state) => state.chartPanel[state.chartPanel.current]);

	const [enteredMa, setEnteredMa] = useState("" + ma);
	const [enteredBreakRatio, setEnteredBreakRatio] = useState("" + breakRatio);
	const [maLock, setMaLock] = useState(false);
	const [breakRatioLock, setBreakRatioLock] = useState(false);
	const [breakRatioDisabled, setBreakRatioDisabled] = useState(false);
	const [enteredColor, setEnteredColor] = useState(color);

	const [invalidInput, setInvalidInput] = useInputInvalid();

	useEffect(() => {
		if (isActive) return;

		setBreakRatioLock(false);
	}, [isActive]);

	useEffect(() => {
		setEnteredMa("" + ma);
	}, [ma]);

	useEffect(() => {
		setEnteredBreakRatio("" + breakRatio);
	}, [breakRatio]);

	useEffect(() => {
		setEnteredColor(color);
	}, [color]);

	useEffect(() => {
		const totalData = ChartUtils.getTotalData();
		if (
			+enteredMa < totalData &&
			+enteredMa > 1 &&
			Number.isInteger(+enteredMa)
		)
			return;

		const setMaChangeTimeout = setTimeout(() => {
			!Number.isInteger(+enteredMa) &&
				setEnteredMa(`${Math.round(+enteredMa)}`);
			+enteredMa >= totalData && setEnteredMa(`${totalData - 1}`);
			+enteredMa <= 1 && setEnteredMa("2");

			setInvalidInput("MA");
		}, +process.env.REACT_APP_INVALID_INPUT_DURATION_MS);

		return () => {
			clearTimeout(setMaChangeTimeout);
		};
	}, [enteredMa, setInvalidInput]);

	useEffect(() => {
		if (maLock) return;

		const setMaTimeout = setTimeout(() => {
			dispatch(setValue({ value: +enteredMa }));
			setMaLock(true);
		}, +process.env.REACT_APP_SEND_REQUEST_DURATION_MS);

		return () => {
			clearTimeout(setMaTimeout);
		};
	}, [enteredMa, dispatch, maLock]);

	useEffect(() => {
		const setColorTimer = setTimeout(() => {
			dispatch(setColor({ color: enteredColor }));
		}, +process.env.REACT_APP_INPUT_CHANGE_DURATION_MS);

		return () => {
			clearTimeout(setColorTimer);
		};
	}, [enteredColor, dispatch]);

	useEffect(() => {
		if (breakRatioLock) return;

		const setBreakRatioTimeout = setTimeout(() => {
			dispatch(setBreakRatio({ breakRatio: +enteredBreakRatio }));
			setBreakRatioLock(true);
		}, +process.env.REACT_APP_SEND_REQUEST_DURATION_MS);

		return () => {
			clearTimeout(setBreakRatioTimeout);
		};
	}, [enteredBreakRatio, dispatch, breakRatioLock]);

	const maChangeHandler = (event) => {
		const { value } = event.target;
		const totalData = ChartUtils.getTotalData();
		setEnteredMa(value);

		if (!(+value < totalData && +value > 1 && Number.isInteger(+value))) return;

		setMaLock(false);
	};

	const maByChangeHandler = (event) => {
		dispatch(setMaBy({ maBy: event.target.value.toLowerCase() }));
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

	const setMaBtnClickHandler = async (event) => {
		event.preventDefault();

		if (!ma) return setInvalidInput("MA");

		const indicatorDataToDB = {
			ma,
			maBy,
			color,
			breakRatio,
			isAbove,
		};

		const indicatorData = {
			...chartData,
			stockData,
			indicatorValue: [ma],
			maBy,
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
			indicatorDataToDB.indicatorType = "ma";
			stockService.addIndicator("ma", indicatorDataToDB);
		}

		if (editId) {
			dispatch(
				updateIndicator({ id: editId, updatedIndicatorData: indicatorData })
			);

			indicatorDataToDB.id = editId;
			stockService.updateIndicator("ma", indicatorDataToDB);
		}

		dispatch(clearCurrent());
	};

	const cancelUpdateBtnClickHandler = async (event) => {
		event.preventDefault();

		dispatch(clearCurrent());
	};

	return (
		<div className="chart-panel-body-indicator">
			<Input
				id="ma"
				type="number"
				name="ma"
				text="Moving Average"
				value={enteredMa}
				step={"1"}
				className="chart-panel-body-input"
				onChange={maChangeHandler}
				invalid={invalidInput === "MA"}
			/>
			<Select
				className="chart-panel-body-select"
				name="maBy"
				id="maBy"
				text="Caculate MA by:"
				value={maBy}
				options={["Close", "Open", "High", "Low"]}
				onChange={maByChangeHandler}
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
				<Button className="chart-button" onClick={setMaBtnClickHandler}>
					Add Moving Average
				</Button>
			)}
			{editId && (
				<div className="update-price-button-wrapper">
					<Button
						className="chart-button chart-button-edit"
						onClick={setMaBtnClickHandler}
					>
						Update Moving Average
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

ChartMaForm.propTypes = {
	editId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	isActive: PropTypes.bool,
};

export default ChartMaForm;
