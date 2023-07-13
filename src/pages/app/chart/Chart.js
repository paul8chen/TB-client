// import { Suspense, useState } from "react";
import { Suspense } from "react";
import { useDispatch } from "react-redux";
import { Await, json, defer, useLoaderData } from "react-router-dom";

import "@pages/app/chart/Chart.scss";
import CandlestickChart from "@components/chart/candlestick-chart/CandlestickChart";
import ChartPanel from "@components/chart/chart-panel/ChartPanel";
import Spinner from "@components/spinner/Spinner";
import { stockService } from "@services/api/stock.service";
import { setIsLoaded } from "@store/reducers/chartReducer";

const Chart = () => {
	const dispatch = useDispatch();
	const { stock } = useLoaderData();

	// console.log("render chart");
	return (
		<Suspense fallback={<Spinner />}>
			<Await resolve={stock}>
				{(stock) => {
					dispatch(setIsLoaded(false));

					return (
						<div className="chart-container">
							<div className="chart-layout">
								<div className="chart-body">
									<CandlestickChart stock={stock.data.stockData} />
								</div>
								<div className="chart-panel">
									<ChartPanel />
								</div>
							</div>
						</div>
					);
				}}
			</Await>
		</Suspense>
	);
};

export default Chart;

async function loadStock() {
	try {
		const response = await stockService.getStock(
			process.env.REACT_APP_CHART_TOTAL_MONTH_OF_DATA
		);
		if (!response.ok)
			throw json({ status: "error", message: "Server unavailable" });

		return await response.json();
	} catch (err) {
		console.log("fetch stock error");
		return err;
	}
}

export function loader() {
	return defer({
		stock: loadStock(),
	});
}
