import { createSlice } from "@reduxjs/toolkit";
import { ChartUtils } from "@services/utils/chart.utils";
import { getIndicatorData } from "@store/api/chartReducer";

const initialState = {
	tickId: "",
	isLoaded: false,
	isIndicatorLoading: false,
	chartClickable: false,
	indicators: [],
	filteredStockData: [],
};

const chartSlice = createSlice({
	name: "chart",
	initialState,
	reducers: {
		setIsLoaded(state, action) {
			const isLoaded = action.payload;
			state.isLoaded = isLoaded;
		},

		setTickId(state, action) {
			const { tickId } = action.payload;
			state.tickId = tickId;
		},

		toggleChartClickable(state) {
			state.chartClickable = !state.chartClickable;
		},

		addIndicator(state, action) {
			const { indicatorData } = action.payload;
			const addedIndicatorData = { ...indicatorData, selected: false };

			state.indicators.push(addedIndicatorData);
		},

		updateIndicator(state, action) {
			const { id } = action.payload;
			const indicatorIndex = state.indicators.findIndex((ind) => ind.id === id);

			if (indicatorIndex === -1) return;

			const { updatedIndicatorData } = action.payload;

			const indicatorData = { ...state.indicators[indicatorIndex] };

			state.indicators[indicatorIndex] = Object.assign(indicatorData, {
				...updatedIndicatorData,
			});
		},

		removeIndicator(state, action) {
			const { id } = action.payload;
			const updatedIndicators = [...state.indicators];
			const selectedIndicators = state.indicators.filter((ind) => ind.selected);

			// 0) Remove indicator from indicators
			if (!removeArrayItemById(updatedIndicators, id)) return;

			state.indicators = updatedIndicators;

			// 1) Check if removed indicator is selected
			console.log("selectedIndicators", selectedIndicators);
			if (!removeArrayItemById(selectedIndicators, id)) return;

			// 2) Update filteredStockData
			const updatedFilteredStockData = selectedIndicators.length
				? selectedIndicators.reduce(
						(agg, { stockData }) =>
							agg.filter(({ x }) =>
								stockData.some(({ x: dataX }) => x === dataX)
							),
						selectedIndicators[0].stockData
				  )
				: [];
			console.log("updatedFilteredStockData", updatedFilteredStockData);
			state.filteredStockData = updatedFilteredStockData;
		},

		toggleIndicator(state, action) {
			const { id, indicatorData } = action.payload;

			const selectedIndicators = state.indicators.filter((ind) => ind.selected);

			if (removeArrayItemById(selectedIndicators, id)) {
				// 1) Update FilteredStockData;
				const updatedFilteredStockData = selectedIndicators.length
					? selectedIndicators.reduce(
							(agg, { stockData }) =>
								agg.filter(({ x }) =>
									stockData.some(({ x: dataX }) => x === dataX)
								),
							selectedIndicators[0].stockData
					  )
					: [];

				state.filteredStockData = updatedFilteredStockData;

				// 2) Update IndicatorSelected as false;
				const selectedIndicatorIndex = state.indicators.findIndex(
					(ind) => ind.id === id
				);
				state.indicators[selectedIndicatorIndex].selected = false;
			} else {
				// 1) Add FilteredStockData
				const addedStockData = [...indicatorData.stockData];
				const { filteredStockData } = state;
				const updatedFilteredStockData = filteredStockData.length
					? addedStockData.filter((data) =>
							filteredStockData.some(
								(ind) => ind.x === data.x && ind.y === data.y
							)
					  )
					: addedStockData;

				state.filteredStockData = updatedFilteredStockData;

				// 2) Update IndicatorSelected as true;
				const selectedIndicatorIndex = state.indicators.findIndex(
					(ind) => ind.id === id
				);

				state.indicators[selectedIndicatorIndex].selected = true;
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getIndicatorData.pending, (state) => {
			state.isIndicatorLoading = true;
		});
		builder.addCase(getIndicatorData.fulfilled, (state, action) => {
			const { data } = action.payload;

			data.indicatorData.sort(
				({ createdAt: a }, { createdAt: b }) => new Date(a) - new Date(b)
			);

			const indicatorData = data.indicatorData.map((dbData) =>
				ChartUtils.convertDBDataToIndicatorData(dbData)
			);

			state.indicators = [...indicatorData];
			state.isIndicatorLoading = false;
		});
		builder.addCase(getIndicatorData.rejected, (state, action) => {
			state.isIndicatorLoading = false;
		});
	},
});

export const {
	setIsLoaded,
	setTickId,
	toggleChartClickable,
	addIndicator,
	updateIndicator,
	removeIndicator,
	toggleIndicator,
	addFilteredStockData,
} = chartSlice.actions;

export default chartSlice.reducer;

function removeArrayItemById(array, id) {
	let removedIndex = array.findIndex((item) => item.id === id);
	const isRemoved = removedIndex !== -1;

	while (removedIndex !== -1) {
		array.splice(removedIndex, 1);
		removedIndex = array.findIndex((item) => item.id === id);
	}

	return isRemoved;
}
