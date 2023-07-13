import BaseService from "@services/api/BaseService";

class StockService extends BaseService {
	constructor() {
		super("/stock");
	}

	getStock(lastNMonth) {
		return this.getData(`/get-stock/${lastNMonth}`);
	}

	getStockFilteredByPrice(price, date, breakRatio, isAbove) {
		return this.getData(
			`/get-price?price=${price}&date=${date}&breakRatio=${breakRatio}&isAbove=${isAbove}`
		);
	}

	getStockFilteredByMA(ma, maBy, candleRatio, isAbove) {
		return this.getData(
			`/get-MA?ma=${ma}&maBy=${maBy}&candleRatio=${candleRatio}&isAbove=${isAbove}&selectedMonth=${process.env.REACT_APP_CHART_TOTAL_MONTH_OF_DATA}`
		);
	}

	getStockFilteredByCandlestick(bodyRatio, upperShadowRatio, candlestickType) {
		return this.getData(
			`/get-candlestick?&upperShadowRatio=${upperShadowRatio}&bodyRatio=${bodyRatio}&candlestickType=${candlestickType}&selectedMonth=${process.env.REACT_APP_CHART_TOTAL_MONTH_OF_DATA}`
		);
	}

	getTick(uId) {
		return this.postData(`/get-tick`, { uId }, "POST");
	}

	getIndicator(tickId) {
		return this.getData(`/get-tick-indicator/${tickId}`);
	}

	addIndicator(indicatorType, data) {
		return this.postData(`/add-${indicatorType}`, data, "POST");
	}

	updateIndicator(indicatorType, data) {
		return this.postData(`/update-${indicatorType}`, data, "PATCH");
	}

	deleteIndicator(indicatorType, data) {
		return this.postData(`/delete-${indicatorType}`, data, "DELETE");
	}
}

export const stockService = new StockService();
