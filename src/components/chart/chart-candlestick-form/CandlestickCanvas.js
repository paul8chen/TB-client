import PropTypes from "prop-types";
import { useCallback, useEffect, useRef } from "react";

const rootStyleEl = getComputedStyle(document.documentElement);
const CANDLE_UP_COLOR = rootStyleEl.getPropertyValue("--green-5");
const CANDLE_DOWN_COLOR = rootStyleEl.getPropertyValue("--red-9");
const CANDLE_SHADOW_COLOR = rootStyleEl.getPropertyValue("--gray-9");

const CandlestickCanvas = ({
	height,
	width,
	bodyRatio,
	shadowThickness,
	upperShadowRatio,
	lowerShadowRatio,
	candlestickType,
	className,
}) => {
	const canvas = useRef();

	const draw = useCallback(
		(ctx) => {
			const candlestickColor =
				candlestickType === "bullish" ? CANDLE_UP_COLOR : CANDLE_DOWN_COLOR;
			const isDoji = candlestickType === "doji" || !bodyRatio;

			const candlestickHeight = 40;
			const candlestickWidth = 10;

			const bodyX = (width - candlestickWidth) * 0.5;
			const bodyHeight = !isDoji ? bodyRatio * candlestickHeight : 2;
			const bodyY = (height - bodyHeight) * 0.5;

			const shadowX = (width - shadowThickness) * 0.5;
			const upperShadowHeight = upperShadowRatio * candlestickHeight;
			const upperShadowY = bodyY - upperShadowHeight;
			const lowerShadowHeight = lowerShadowRatio * candlestickHeight;
			const lowerShadowY = bodyY + bodyHeight;
			ctx.clearRect(0, 0, width, height);

			ctx.fillStyle = candlestickColor;
			upperShadowHeight &&
				ctx.fillRect(shadowX, upperShadowY, shadowThickness, upperShadowHeight);

			bodyHeight && ctx.fillRect(bodyX, bodyY, candlestickWidth, bodyHeight);

			lowerShadowHeight &&
				ctx.fillRect(shadowX, lowerShadowY, shadowThickness, lowerShadowHeight);

			ctx.shadowBlur = 1;
			ctx.shadowColor = CANDLE_SHADOW_COLOR;
		},
		[
			bodyRatio,
			upperShadowRatio,
			lowerShadowRatio,
			shadowThickness,
			candlestickType,
			height,
			width,
		]
	);

	useEffect(() => {
		if (!canvas.current) return;

		const context = canvas.current.getContext("2d");
		draw(context);
	});

	return (
		<canvas className={className} ref={canvas} height={height} width={width} />
	);
};

CandlestickCanvas.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	bodyWidth: PropTypes.number,
	bodyRatio: PropTypes.number,
	shadowThickness: PropTypes.number,
	upperShadowRatio: PropTypes.number,
	lowerShadowRatio: PropTypes.number,
	candlestickType: PropTypes.string,
	className: PropTypes.string,
};

CandlestickCanvas.defaultProps = {
	height: 100,
	width: 100,
	shadowThickness: 2,
};
export default CandlestickCanvas;
