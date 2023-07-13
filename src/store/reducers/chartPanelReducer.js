import { createSlice } from "@reduxjs/toolkit";
// import { cloneDeep } from "loadsh";

const rootStyleEl = getComputedStyle(document.documentElement);
const PRICE_COLOR = rootStyleEl.getPropertyValue("--primary-1");
const MA_COLOR = rootStyleEl.getPropertyValue("--orange-2");
const INITIAL_DATE = new Date().setMonth(
	new Date().getMonth() - process.env.REACT_APP_CHART_TOTAL_MONTH_OF_DATA
);
// REACT_APP_PRIMARY_COLOR_2 = "#00c6fb";

const initialState = {
	isActive: false,
	current: "price",
	editId: "",
	price: {
		isIndicator: true,
		value: "",
		date: INITIAL_DATE,
		color: PRICE_COLOR,
		breakRatio: 0.5,
		isAbove: false,
		stockData: [],
		chartData: {
			type: "line",
			color: PRICE_COLOR,
			markerType: "none",
			dataPoints: [],
			indicatorType: "price",
		},
	},
	ma: {
		isIndicator: true,
		value: 30,
		maBy: "close",
		breakRatio: 0.5,
		isAbove: false,
		color: MA_COLOR,
		stockData: [],
		maData: [],
		chartData: {
			type: "line",
			color: MA_COLOR,
			markerType: "none",
			dataPoints: [],
			indicatorType: "ma",
		},
	},

	candlestick: {
		isIndicator: true,
		value: 0.5,
		upperShadow: 0.25,
		lowerShadow: 0.25,
		candlestickType: "bullish",
		stockData: [],
		chartData: {
			indicatorType: "candlestick",
		},
	},
	post: { isIndicator: false },
	backtesting: { isIndicator: false },
};

const chartPanelSlice = createSlice({
	name: "chartPanel",
	initialState,
	reducers: {
		setCurrent(state, action) {
			const { current } = action.payload;

			state[state.current] = initialState[state.current];
			state.current = current;
			state.isActive = state[state.current].isIndicator;
			state.editId = "";
		},

		setEditId(state, action) {
			const { id } = action.payload;

			state.editId = id;
			state.isActive = true;
		},

		setCurrentAsEdit(state, action) {
			const { current, panelData } = action.payload;
			// const editPanelData = cloneDeep(panelData);
			const editPanelData = { ...panelData };
			state.current = current;
			state[current] = Object.assign({ ...state[current] }, editPanelData);
		},

		setValue(state, action) {
			const { value } = action.payload;
			state[state.current].value = value;

			if (!state.isActive) state.isActive = true;
		},

		setDate(state, action) {
			const { date } = action.payload;
			state[state.current].date = date;
		},

		clearCurrent() {
			return { ...initialState };
		},

		setBreakRatio(state, action) {
			const { breakRatio } = action.payload;
			state[state.current].breakRatio = breakRatio;
		},

		setAbove(state, action) {
			const { isAbove } = action.payload;
			state[state.current].isAbove = isAbove;
		},

		setColor(state, action) {
			const { color } = action.payload;
			state[state.current].color = color;
		},

		setChartData(state, action) {
			const { chartData } = action.payload;

			const updatedChartData = Object.assign(
				{ ...state[state.current].chartData },
				{ ...chartData }
			);

			state[state.current].chartData = updatedChartData;
		},

		setStockData(state, action) {
			const { filteredStockData } = action.payload;
			state[state.current].stockData = filteredStockData;
		},

		setMaData(state, action) {
			const { maData } = action.payload;
			state.ma.maData = [...maData];
		},

		setPanelIsActive(state, action) {
			const { isActive } = action.payload;

			state.isActive = state[state.current].isIndicator && isActive;
		},

		setMaBy(state, action) {
			const { maBy } = action.payload;

			state[state.current].maBy = maBy;
		},

		setCandlestickType(state, action) {
			const { candlestickType } = action.payload;

			state.candlestick.candlestickType = candlestickType;
		},

		setShadow(state, action) {
			const { upperShadow, lowerShadow } = action.payload;

			state.candlestick.upperShadow = upperShadow;
			state.candlestick.lowerShadow = lowerShadow;
		},
	},
});

export const {
	setCurrent,
	setValue,
	setDate,
	setBreakRatio,
	setAbove,
	setColor,
	clearCurrent,
	setChartData,
	setStockData,
	setMaData,
	setEditId,
	setCurrentAsEdit,
	setPanelIsActive,
	setMaBy,
	setCandlestickType,
	setShadow,
} = chartPanelSlice.actions;

export default chartPanelSlice.reducer;
