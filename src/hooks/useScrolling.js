import { useCallback, useEffect } from "react";

const useScrolling = (bodyRef, bottomRef, callback) => {
	const handleScroll = useCallback(() => {
		if (!bottomRef.current) return;

		const containerHeight = bodyRef.current?.getBoundingClientRect().height;
		const { top: bottomLineTop } = bottomRef.current?.getBoundingClientRect();
		console.log("bottomLineTop", bottomLineTop);
		console.log("containerHeight", containerHeight);
		if (bottomLineTop <= containerHeight) {
			callback();
		}
	}, [bodyRef, bottomRef, callback]);

	useEffect(() => {
		const bodyRefCurrent = bodyRef?.current;

		bodyRefCurrent?.addEventListener("scroll", handleScroll, true);

		return () =>
			bodyRefCurrent.removeEventListener("scroll", handleScroll, true);
	}, [bodyRef, handleScroll, bottomRef]);
};

export default useScrolling;
