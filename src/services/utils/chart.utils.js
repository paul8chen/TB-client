import { chart } from "@components/chart/candlestick-chart/CandlestickChart";

const rootStyleEl = getComputedStyle(document.documentElement);
const BACKGROUND_COLOR = rootStyleEl.getPropertyValue("--white-10");
const LABEL_FONT_COLOR = rootStyleEl.getPropertyValue("--gray-9");
const CANDLE_UP_COLOR = rootStyleEl.getPropertyValue("--green-5");
const CANDLE_DOWN_COLOR = rootStyleEl.getPropertyValue("--red-9");
const GRID_COLOR = rootStyleEl.getPropertyValue("--white-9");
const AXIS_Y_CROSS_COLOR = rootStyleEl.getPropertyValue("--gray-10");
const CROSS_LABEL_FONT_COLOR = rootStyleEl.getPropertyValue("--white-1");
const CROSS_LABEL_BACKGROUND_COLOR =
	rootStyleEl.getPropertyValue("--primary-1");

export class ChartUtils {
	latestData;
	decimalLength;

	static creatChartOptions(data, addedData) {
		console.log("❤set options addedData❤", addedData);
		this.latestData = data.slice(-1)[0];

		const latestPriceSplitByFloat = ("" + this.latestData.y[3]).split(".");
		const integerLength = latestPriceSplitByFloat[0].length;
		const decimalLength = latestPriceSplitByFloat[1]?.length;

		this.decimalLength = decimalLength;

		return {
			theme: "light2",
			animationEnabled: true,
			zoomEnable: true,
			backgroundColor: BACKGROUND_COLOR,
			height: 600,
			width: 1300,

			title: {
				text: "BTCUSDT",
				fontSize: 16,
				fontWeight: "bolder",
				horizontalAlign: "left",
				margin: 30,
			},
			subtitles: [
				{
					backgroundColor: BACKGROUND_COLOR,
					fontColor: LABEL_FONT_COLOR,
					horizontalAlign: "right",
					fontSize: 12,
				},
			],

			toolTip: {
				backgroundColor: "inherit",
				borderThickness: 0,
				fontColor: LABEL_FONT_COLOR,
				contentFormatter: function (e) {
					const { type } = e.entries[0].dataSeries;
					const [open, high, low, close] =
						type === "candlestick"
							? e.entries[0].dataPoint.y
							: this.latestData.y;

					return `<span>OPEN:<span style="color:${CROSS_LABEL_BACKGROUND_COLOR};margin-right:2px">${open}</span> HIGH:<span style="color:${CROSS_LABEL_BACKGROUND_COLOR};margin-right:2px">${high}</span> LOW:<span style="color:${CROSS_LABEL_BACKGROUND_COLOR};margin-right:2px">${low}</span> CLOSE:<span style="color:${CROSS_LABEL_BACKGROUND_COLOR}">${close}</span></span>`;
				}.bind(this),
			},
			axisY: {
				labelFontColor: LABEL_FONT_COLOR,
				labelFontSize: 11,
				labelFontWeight: "lighter",
				gridThickness: 2,
				gridColor: GRID_COLOR,
				tickColor: GRID_COLOR,
				tickThickness: 2,
				crosshair: {
					enabled: true,
					snapToDataPoint: true,
					lineDashType: "solid",
					thickness: 2,
					valueFormatString: `${"#".repeat(integerLength)}.${"#".repeat(
						decimalLength
					)}`,
					color: AXIS_Y_CROSS_COLOR,
					labelFontSize: 14,
					labelFontColor: CROSS_LABEL_FONT_COLOR,
					labelBackgroundColor: CROSS_LABEL_BACKGROUND_COLOR,
				},
			},
			axisX: {
				labelFontColor: LABEL_FONT_COLOR,
				crosshair: {
					enabled: true,
					snapToDataPoint: true,
					thickness: 1,
					lineDashType: "shortDash",
					color: AXIS_Y_CROSS_COLOR,
					labelFontSize: 14,
					labelFontColor: CROSS_LABEL_FONT_COLOR,
					labelBackgroundColor: CROSS_LABEL_BACKGROUND_COLOR,
				},
				valueFormatString: "D'MMM",
				labelFontWeight: "lighter",
				labelFontSize: 12,
			},

			data: [
				{
					type: "candlestick",
					color: "none",
					risingColor: CANDLE_UP_COLOR,
					fallingColor: CANDLE_DOWN_COLOR,
					yValueFormatString: `${"#".repeat(integerLength)}.${"#".repeat(
						decimalLength
					)}`,
					xValueFormatString: "D'MMM",
					dataPoints: data.map((el) => {
						const open = el.y[0];
						const close = el.y[3];
						return {
							x: new Date(el.x),
							y: el.y,
							color: close > open ? CANDLE_UP_COLOR : CANDLE_DOWN_COLOR,
						};
					}),
				},
				...addedData,
			],
		};
	}

	static getDataDecimalLength() {
		return this.decimalLength;
	}

	static setTooltipPosition() {
		if (!chart) return;
		const chartEl = chart.container;
		const chartX = chartEl.getBoundingClientRect().x + chart.bounds.x2;
		const chartY = chartEl.getBoundingClientRect().y;
		const tooltipEl = chart.toolTip.container;
		tooltipEl.style.boxShadow = "none";
		const tooltipContentEl = chart.toolTip.contentDiv;
		tooltipContentEl.style.position = "fixed";
		tooltipContentEl.style.top = `${chartY}px`;
		tooltipContentEl.style.left = `${chartX + chart.bounds.x2 * 0.75}px`;
		tooltipContentEl.style.transform = "translate(0%, 50%)";
	}

	static getAxisLimit() {
		const { maximum: maxY, minimum: minY } = chart.axisY[0];
		const { maximum: maxX, minimum: minX } = chart.axisX[0];
		return { maxY, minY, maxX, minX };
	}

	static getTotalData() {
		return chart.data[0].dataPoints.length;
	}

	static converDateToChartDate(date) {
		const { dataPoints } = chart.data[0];
		const chartDateIndex = dataPoints.findIndex(
			(data) => data.x >= new Date(date)
		);

		return +dataPoints[chartDateIndex].x;
	}

	static getStockDataChartPixel(stockData) {
		const { x, y } = stockData;
		const xPixel = chart.axisX[0].convertValueToPixel(x);
		const yPixel = chart.axisY[0].convertValueToPixel(y * 1.01);

		return [xPixel, yPixel];
	}

	static addScatter(stockData, color) {
		const scatterIndex = chart.data.findIndex(
			(dataSeries) => dataSeries.type === "scatter"
		);

		if (scatterIndex !== -1) {
			chart.data[scatterIndex].set("dataPoints", stockData);
			chart.data[scatterIndex].set("color", color);
			return;
		}

		chart.addTo("data", {
			type: "scatter",
			color,
			markerType: "circle",
			markerSize: 15,
			dataPoints: stockData,
		});
	}

	static getPriceDataPoints(stockData) {
		return [stockData, { x: this.latestData.x, y: stockData.y }];
	}

	static getMaDataPoints(stockData) {
		return [stockData];
	}

	static convertIndicatorDataToPanelData(indicatorData) {
		const { indicatorType } = indicatorData;

		if (indicatorType === "price") return this.getPricePanelData(indicatorData);

		if (indicatorType === "ma") return this.getMaPanelData(indicatorData);

		if (indicatorType === "candlestick")
			return this.getCandlestickPanelData(indicatorData);
	}

	static getPricePanelData(indicatorData) {
		const { indicatorValue, color, breakRatio, isAbove, dataPoints } =
			indicatorData;

		return {
			value: indicatorValue[0],
			date: dataPoints[0].x,
			color,
			breakRatio,
			isAbove,
		};
	}

	static getMaPanelData(indicatorData) {
		const { indicatorValue, maBy, color, breakRatio, isAbove } = indicatorData;

		return {
			value: indicatorValue[0],
			maBy,
			color,
			breakRatio,
			isAbove,
		};
	}

	static getCandlestickPanelData(indicatorData) {
		const { indicatorValue, upperShadow, lowerShadow, candlestickType } =
			indicatorData;
		console.log("💥indicatorData: ", indicatorData);

		return {
			value: indicatorValue[0],
			upperShadow,
			lowerShadow,
			candlestickType,
		};
	}

	static deleteAllAnnotation() {
		const chart = ChartUtils.getApexChart();
		const { series } = chart.w.config;

		chart.updateOptions({
			annotations: { yaxis: [], points: [] },
			series: [series[0]],
		});
	}
}
