import { createSlice } from "@reduxjs/toolkit";

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

const initialState = {
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
				type === "candlestick" ? e.entries[0].dataPoint.y : this.latestData.y;

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
			valueFormatString: () => {},
			// `${"#".repeat(integerLength)}.${"#".repeat(
			// decimalLength
			// )}`,
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
			yValueFormatString: () => {},
			// `${"#".repeat(integerLength)}.${"#".repeat(
			// 	decimalLength
			// )}`,
			xValueFormatString: "D'MMM",
			dataPoints: [],
		},
	],
};

const chartOptionSlice = createSlice({
	name: "chartOption",
	initialState,
	reducers: {
		initChartOption(state, action) {
			const { data } = action.payload;
			console.log("data", data);

			state.data[0].dataPoints = data.map((el) => {
				const open = el.y[0];
				const close = el.y[3];
				return {
					x: new Date(el.x),
					y: el.y,
					color: close > open ? CANDLE_UP_COLOR : CANDLE_DOWN_COLOR,
				};
			});
		},
	},
});

export const { initChartOption } = chartOptionSlice.actions;
export default chartOptionSlice.reducer;
