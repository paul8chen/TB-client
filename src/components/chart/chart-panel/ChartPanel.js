import { useSelector, useDispatch } from "react-redux";
import { FiEdit2 } from "react-icons/fi";

import "@components/chart/chart-panel/ChartPanel.scss";
import ChartPriceForm from "@components/chart/chart-price-form/ChartPriceForm";
import ChartMaForm from "@components/chart/chart-ma-form/chartMaForm";
import ChartCandlestickForm from "@components/chart/chart-candlestick-form/chartCandlestickForm";
import { setCurrent } from "@store/reducers/chartPanelReducer";

function ChartPanel() {
	// console.log("render panel");
	const { current, editId, isActive } = useSelector(
		(state) => state.chartPanel
	);
	const dispatch = useDispatch();

	const navbarClickHandler = (event) => {
		const clickedNav = event.target.closest(".chart-panel-navbar-item");
		if (!clickedNav) return;

		const navbarEl = clickedNav.closest(".chart-panel-navbar");
		const prevActiveNav = navbarEl.querySelector(".active");
		if (clickedNav === prevActiveNav) return;

		const clickedNavIndex = [...navbarEl.children].findIndex(
			(el) => el === clickedNav
		);
		const prevActiveNavIndex = [...navbarEl.children].findIndex(
			(el) => el === prevActiveNav
		);

		clickedNavIndex > prevActiveNavIndex &&
			clickedNav.classList.add("to-the-right");
		clickedNavIndex < prevActiveNavIndex &&
			clickedNav.classList.add("to-the-left");

		clickedNav.classList.add("active");
		prevActiveNav.classList.remove("active");
		prevActiveNav.classList.remove("to-the-left");
		prevActiveNav.classList.remove("to-the-right");

		const { current } = clickedNav.dataset;

		setTimeout(() => {
			dispatch(setCurrent({ current }));
		}, 300);
	};

	return (
		<div className="chart-panel-container">
			<div className="chart-panel-layout">
				<div className="chart-panel-navbar" onClick={navbarClickHandler}>
					<div
						className={`chart-panel-navbar-item ${
							current === "price" ? "active" : ""
						}`}
						data-current="price"
					>
						<p>Price</p>
						<div className={`sliding-bar ${editId ? "editting" : ""}`} />
					</div>
					<div
						className={`chart-panel-navbar-item ${
							current === "ma" ? "active" : ""
						}`}
						data-current="ma"
					>
						<p>Moving Average</p>
						<div className={`sliding-bar ${editId ? "editting" : ""}`} />
					</div>
					<div
						className={`chart-panel-navbar-item ${
							current === "candlestick" ? "active" : ""
						}`}
						data-current="candlestick"
					>
						<p>Candlestick</p>
						<div className={`sliding-bar ${editId ? "editting" : ""}`} />
					</div>
					<div
						className={`chart-panel-navbar-item ${
							current === "post" ? "active" : ""
						}`}
						data-current="post"
					>
						<p>Post</p>
						<div className={`sliding-bar ${editId ? "editting" : ""}`} />
					</div>
					<div
						className={`chart-panel-navbar-item ${
							current === "backtesting" ? "active" : ""
						}`}
						data-current="backtesting"
					>
						<p>Backtesting</p>
						<div className={`sliding-bar ${editId ? "editting" : ""}`} />
					</div>
					<div className="sliding-bar-container " />
				</div>
				<div className={`chart-panel-body ${editId ? "editting" : ""}`}>
					{editId && <FiEdit2 className="chart-panel-body-edit" />}
					{current === "price" && (
						<ChartPriceForm editId={editId} isActive={isActive} />
					)}
					{current === "ma" && (
						<ChartMaForm editId={editId} isActive={isActive} />
					)}
					{current === "candlestick" && (
						<ChartCandlestickForm editId={editId} isActive={isActive} />
					)}
				</div>
			</div>
		</div>
	);
}

export default ChartPanel;
