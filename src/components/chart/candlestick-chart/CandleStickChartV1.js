import PropTypes from "prop-types";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
// import { useEffect } from "react";
import { useSelector } from "react-redux";
import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit2 } from "react-icons/fi";

import "@components/chart/candle-stick-chart/CandleStickChart.scss";
import { ChartUtils } from "@services/utils/chart.utils";
// import { setId, setPrice } from "@store/reducers/chartPanelReducer";

const CandleStickChart = ({ data, latestPrice }) => {
	const options = ChartUtils.creatApexChartOptions(latestPrice);
	const series = [{ name: "candle", type: "candlestick", data }];
	// const dispatch = useDispatch();
	// const { color, id: priceId } = useSelector((state) => state.chartPanel.price);
	const { indicators, selectedIndicators } = useSelector(
		(state) => state.chart
	);

	// useEffect(() => {
	// 	console.log("entered");
	// 	if (locked) return;
	// 	console.log("updateOptions");
	// if (priceId !== "") ChartUtils.deleteYaxisAnnotation(priceId);
	// 	const id = ChartUtils.getIndicatorId("price", price);
	// 	const offsetX = ChartUtils.getOffsetXByDate(priceDate);

	// 	ChartUtils.addYaxisAnnotation({ id, offsetX, y: price, color });
	// 	dispatch(setId({ id }));
	// 	dispatch(setLocked({ locked: true }));
	// }, [price, priceId, color, priceDate, locked, dispatch]);
	// const chartClickHandler = (event, chartContext, config) => {
	// 	const { dataPointIndex } = config;
	// 	if (dataPointIndex === -1) return;

	// 	const { seriesX, seriesXvalues } = config.globals;
	// 	const date = seriesX[0][dataPointIndex];
	// 	const y = config.globals.tooltip.yaxisTooltip.textContent;
	// 	const id = ChartUtils.getIndicatorId("price", y);
	// 	const offsetX = seriesXvalues[0][dataPointIndex];
	// 	// const offsetX = ChartUtils.getOffsetXByDate(Utils.getISOStringDate(date));
	// 	if (priceId !== "") ChartUtils.deleteYaxisAnnotation(priceId);

	// 	ChartUtils.addYaxisAnnotation({ id, offsetX, y, color });
	// 	dispatch(setPrice({ val: y, date }));
	// 	// dispatch(togglePriceChartClickable());
	// 	dispatch(setId({ id }));
	// };

	// useEffect(() => {
	// 	if (!chartClickable) return ChartUtils.removeChartClickHandler();

	// 	const chartClickHandler = (event, chartContext, config) => {
	// 		const { dataPointIndex } = config;
	// 		if (dataPointIndex === -1) return;

	// 		const { seriesX, seriesXvalues } = config.globals;
	// 		const date = seriesX[0][dataPointIndex];
	// 		const y = config.globals.tooltip.yaxisTooltip.textContent;
	// 		const id = ChartUtils.getIndicatorId("price", y);
	// 		const offsetX = seriesXvalues[0][dataPointIndex];
	// 		// const offsetX = ChartUtils.getOffsetXByDate(Utils.getISOStringDate(date));
	// 		// if (priceId !== "") ChartUtils.deleteYaxisAnnotation(priceId);

	// 		ChartUtils.addYaxisAnnotation({ id, offsetX, y, color });
	// 		dispatch(setPrice({ val: y, date }));
	// 		// dispatch(togglePriceChartClickable());
	// 		dispatch(setId({ id }));
	// 		// dispatch(setLocked({ locked: false }));
	// 	};
	// 	ChartUtils.addChartClickHandler(chartClickHandler);
	// }, [chartClickable, dispatch, color, priceId]);

	const optionDeleteClickHandler = (event) => {
		event.stopPropagation();
		const itemEl = event.target.closest(".indicator-item");
		const { id: priceLineId } = itemEl.dataset;
		const chart = ApexCharts.getChartByID("chartBarSeries");

		const yaxis = [...chart.w.config.annotations.yaxis];
		const deletedYaxisIndex = yaxis.findIndex((y) => y.id === priceLineId);
		yaxis.splice(deletedYaxisIndex, 1);
		chart.updateOptions({ annotations: { yaxis } });
	};

	const indicatorItemClickHandler = (event) => {
		const itemEl = event.target.closest(".indicator-item");
		const { id } = itemEl.dataset;
		console("id", id);
	};

	return (
		<div className="candle-stick-chart-container">
			<div id="chart">
				<ReactApexChart
					options={options}
					type="candlestick"
					series={series}
					width={"1300px"}
					height={"650px"}
				/>
			</div>
			<div className="indicator-container">
				<div className="indicator-body">
					{indicators.map((indicator) => (
						<div
							className={`indicator-item ${
								selectedIndicators.find(
									(selectedIndicator) => selectedIndicator.id === indicator.id
								)
									? "active"
									: ""
							}`}
							key={indicator.id}
							data-id={indicator.id}
							onClick={indicatorItemClickHandler}
						>
							<p className="indicator-item-type">{indicator.id}</p>
							<p className="indicator-item-value">{indicator.y}</p>
							<span className="indicator-item-style"></span>
							<div className="indicator-item-option">
								<div className="indicator-item-option-update">
									<FiEdit2 />
								</div>
								<div
									className="indicator-item-option-delete"
									onClick={optionDeleteClickHandler}
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
};

CandleStickChart.propTypes = {
	data: PropTypes.array.isRequired,
	latestPrice: PropTypes.number.isRequired,
};

export default CandleStickChart;
