import PropTypes from "prop-types";
import CanvasJSReact from "@canvasjs/react-charts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlRocket } from "react-icons/sl";
import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit2 } from "react-icons/fi";
import { cloneDeep } from "lodash";

import FadeLoader from "@components/fade-loader/FadeLoader";
import "@components/chart/candlestick-chart/CandlestickChart.scss";
import { ChartUtils } from "@services/utils/chart.utils";
import {
	setValue,
	setDate,
	setStockData,
	setCurrentAsEdit,
	setEditId,
	setChartData,
	setPanelIsActive,
	clearCurrent,
	setMaData,
} from "@store/reducers/chartPanelReducer";
import { stockService } from "@services/api/stock.service";
import {
	toggleChartClickable,
	removeIndicator,
	setIsLoaded,
	toggleIndicator,
	setTickId,
	updateIndicator,
} from "@store/reducers/chartReducer";
import { getIndicatorData } from "@store/api/chartReducer";
import { Utils } from "@services/utils/utils.service";
import useEffectOnce from "@hooks/useEffectOnce";
import useLocalStorage from "@hooks/useLocalStorage";

export let chart;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const indicatorTypeWithStyle = ["price", "ma"];

function CandlestickChart({ stock }) {
	// console.log("render chart-candlestick");
	const uId = useLocalStorage("uId", "get");
	const tickIdStorage = useLocalStorage("tickId", "get");
	const [options, setOptions] = useState();
	const dispatch = useDispatch();
	const {
		tickId,
		chartClickable,
		isLoaded: isChartLoaded,
		isIndicatorLoading,
		indicators,
		filteredStockData,
	} = useSelector((state) => state.chart);

	const {
		isActive: isPanelActive,
		current,
		editId,
	} = useSelector((state) => state.chartPanel);

	const {
		color,
		value,
		maBy,
		date,
		breakRatio,
		isAbove,
		chartData,
		stockData,
		maData,
		upperShadow,
		candlestickType,
	} = useSelector((state) => state.chartPanel[current]);

	const loadTickId = async () => {
		if (tickIdStorage) return;

		try {
			const response = await stockService.getTick("" + uId);
			const resData = await response.json();
			const defaultTickId = resData.data.tickData[0].id;
			dispatch(setTickId({ tickId: defaultTickId }));
		} catch (error) {
			console.log("fetch tick data error", error);
		}
	};
	useEffectOnce(loadTickId);

	useEffect(() => {
		if (!tickId) return;
		dispatch(getIndicatorData(tickId));
	}, [tickId, dispatch]);

	useEffect(() => {
		if (isPanelActive)
			return setOptions(ChartUtils.creatChartOptions(stock, [chartData]));

		const addedData = indicators.filter((ind) => ind.selected);

		setOptions(ChartUtils.creatChartOptions(stock, addedData));
	}, [indicators, stock, isPanelActive, chartData]);

	useEffect(() => {
		if (isChartLoaded) return;

		console.log("useEffectOnce");
		const setIsChartLoadedTimeout = setTimeout(() => {
			dispatch(setIsLoaded(true));
		}, 1200);

		return () => {
			clearTimeout(setIsChartLoadedTimeout);
		};
	}, [isChartLoaded, dispatch]);

	useEffect(() => {
		if (!isChartLoaded) return;

		let loadFilterdStockData = () => {};

		if (current === "price" && value)
			loadFilterdStockData = async () => {
				try {
					const response = await stockService.getStockFilteredByPrice(
						value,
						new Date(date).toISOString(),
						breakRatio,
						isAbove
					);
					const resData = await response.json();
					const filteredStockData = resData.data.filteredData;

					dispatch(setStockData({ filteredStockData }));
				} catch (err) {
					console.log("Load price filtered error", err);
				}
			};

		if (current === "ma" && value)
			loadFilterdStockData = async () => {
				try {
					const response = await stockService.getStockFilteredByMA(
						value,
						maBy,
						breakRatio,
						isAbove
					);
					const resData = await response.json();
					const { maData, stockData } = resData.data;

					dispatch(setMaData({ maData }));
					dispatch(setStockData({ filteredStockData: stockData }));
				} catch (err) {
					console.log("Load ma filtered error", err);
				}
			};

		if (current === "candlestick" && (value || candlestickType))
			loadFilterdStockData = async () => {
				try {
					const response = await stockService.getStockFilteredByCandlestick(
						value,
						upperShadow,
						candlestickType
					);
					const resData = await response.json();
					const { stockData } = resData.data;

					dispatch(setStockData({ filteredStockData: stockData }));
				} catch (err) {
					console.log("Load candlestick filtered error", err);
				}
			};

		loadFilterdStockData();
	}, [
		dispatch,
		value,
		maBy,
		date,
		breakRatio,
		isAbove,
		isChartLoaded,
		current,
		upperShadow,
		candlestickType,
	]);

	useEffect(() => {
		if (!isChartLoaded || !value) return;

		let dataPoints;
		if (current === "price")
			dataPoints = ChartUtils.getPriceDataPoints({ x: date, y: value });

		if (current === "ma") dataPoints = maData;

		dataPoints && dispatch(setChartData({ chartData: { color, dataPoints } }));
	}, [dispatch, isChartLoaded, current, value, date, color, maData]);

	const chartClickHandler = () => {
		const { value: clickedValue } = chart.axisY[0].crosshair;
		const { value: clickedDate } = chart.axisX[0].crosshair;

		dispatch(setValue({ value: clickedValue }));
		dispatch(setDate({ date: +clickedDate }));
		dispatch(toggleChartClickable());
	};

	const chartOnRefHandler = (ref) => {
		chart = ref;
		ChartUtils.setTooltipPosition();
		console.log("onRef", chart);
	};

	const deleteClickHandler = (event) => {
		event.stopPropagation();

		const itemEl = event.target.closest(".indicator-item");
		const { id: removedId } = itemEl.dataset;
		const { indicatorType } = indicators.find((ind) => ind.id === removedId);

		editId === removedId && dispatch(clearCurrent());
		dispatch(removeIndicator({ id: removedId }));
		stockService.deleteIndicator(indicatorType, { id: removedId, tickId });
	};

	const editClickHandler = (event) => {
		event.stopPropagation();

		const itemEl = event.target.closest(".indicator-item");
		const { id: editId } = itemEl.dataset;
		const indicatorData = indicators.find((ind) => ind.id === editId);
		const current = indicatorData.indicatorType;
		const panelData = ChartUtils.convertIndicatorDataToPanelData(indicatorData);

		dispatch(setEditId({ id: editId }));
		dispatch(setCurrentAsEdit({ current, panelData }));
	};

	const indicatorItemClickHandler = async (event) => {
		const itemEl = event.target.closest(".indicator-item");
		const { id: clickedId } = itemEl.dataset;
		const indicatorData = indicators.find((ind) => ind.id === clickedId);
		const indicatorDataLoaded = cloneDeep(indicatorData);

		if (!indicatorData.loaded && !itemEl.classList.contains("active")) {
			await ChartUtils.loadStockData(indicatorDataLoaded);
			dispatch(
				updateIndicator({
					id: clickedId,
					updatedIndicatorData: indicatorDataLoaded,
				})
			);
		}

		dispatch(setPanelIsActive({ isActive: false }));
		dispatch(
			toggleIndicator({ id: clickedId, indicatorData: indicatorDataLoaded })
		);
	};
	return (
		<div className="candle-stick-chart-container">
			<div
				id="chart"
				className="candle-stick-chart"
				onClick={chartClickable ? chartClickHandler : null}
			>
				<CanvasJSChart options={options} onRef={chartOnRefHandler} />

				{isChartLoaded &&
					!isIndicatorLoading &&
					!isPanelActive &&
					filteredStockData.map((data) => {
						const [left, top] = ChartUtils.getStockDataChartPixel(data);
						return (
							<SlRocket
								key={data.x}
								className="candle-stick-chart-icon"
								style={{ top: `${top}px`, left: `${left}px` }}
							/>
						);
					})}
				{isChartLoaded &&
					!isIndicatorLoading &&
					isPanelActive &&
					stockData.map((data) => {
						const [left, top] = ChartUtils.getStockDataChartPixel(data);
						return (
							<SlRocket
								key={data.x}
								className="candle-stick-chart-icon"
								style={{ top: `${top}px`, left: `${left}px` }}
							/>
						);
					})}
			</div>
			<div className="indicator-container">
				<FadeLoader loading={isIndicatorLoading} />

				<div className="indicator-body">
					{!isIndicatorLoading &&
						indicators.map((indicator) => (
							<div
								className={`indicator-item ${
									indicator.selected ? "active" : ""
								} ${indicator.id === editId ? "editting" : ""}`}
								key={indicator.id}
								data-id={indicator.id}
								onClick={indicatorItemClickHandler}
							>
								<p className="indicator-item-type">
									{Utils.firstLetterUpperCase(indicator.indicatorType)}
								</p>
								{indicator.indicatorValue.map((value, index) => (
									<p
										className="indicator-item-value"
										key={`${indicator.id}${index}`}
									>
										{value}
									</p>
								))}
								{indicatorTypeWithStyle.includes(indicator.indicatorType) && (
									<span
										className="indicator-item-style"
										style={{ borderColor: `${indicator.color}` }}
									></span>
								)}

								<div className="indicator-item-option">
									<div
										className="indicator-item-option-update"
										onClick={editClickHandler}
									>
										<FiEdit2 />
									</div>
									<div
										className="indicator-item-option-delete"
										onClick={deleteClickHandler}
									>
										<HiOutlineTrash />
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

CandlestickChart.propTypes = {
	stock: PropTypes.array.isRequired,
	tick: PropTypes.array.isRequired,
};

CandlestickChart.defaultProps = {
	tick: [],
};

export default CandlestickChart;
