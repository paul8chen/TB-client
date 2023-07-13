import { createAsyncThunk } from "@reduxjs/toolkit";
import { stockService } from "@services/api/stock.service";

const getIndicatorData = createAsyncThunk("chart/getTick", async (tickId) => {
	try {
		const response = await stockService.getIndicator(tickId);
		console.log("💥EXTRA REDUCER💥 ", tickId);
		return response.json();
	} catch (error) {
		console.log("fetch indicator data error", error);
	}
});

export { getIndicatorData };
