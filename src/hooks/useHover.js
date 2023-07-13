import { useEffect, useState } from "react";

const useHover = (ref, showRef) => {
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		let useHookTimeout;
		const mouseEnterHandler = (event) => {
			if (event.relatedTarget === showRef.current) return;

			clearTimeout(useHookTimeout);

			useHookTimeout = setTimeout(() => {
				setIsActive(true);
			}, 700);
		};

		const mouseLeaveHandler = (event) => {
			if (event.relatedTarget === showRef.current) return;

			clearTimeout(useHookTimeout);

			useHookTimeout = setTimeout(() => {
				setIsActive(false);
			}, 700);
		};

		const el = ref.current;
		if (!el) return;

		el.addEventListener("mouseenter", mouseEnterHandler);
		el.addEventListener("mouseleave", mouseLeaveHandler);

		return () => {
			el.removeEventListener("mouseenter", mouseEnterHandler);
			el.removeEventListener("mouseleave", mouseLeaveHandler);
		};
	}, [ref, showRef]);

	useEffect(() => {
		let useHookTimeout;

		const mouseEnterShowHandler = (event) => {
			if (event.relatedTarget === ref.current) return;

			clearTimeout(useHookTimeout);

			useHookTimeout = setTimeout(() => {
				setIsActive(true);
			}, 700);
		};

		const mouseLeaveShowHandler = (event) => {
			if (event.relatedTarget === ref.current) return;

			clearTimeout(useHookTimeout);

			useHookTimeout = setTimeout(() => {
				setIsActive(false);
			}, 700);
		};

		const elShow = showRef.current;

		if (!elShow) return;

		elShow.addEventListener("mouseenter", mouseEnterShowHandler);
		elShow.addEventListener("mouseleave", mouseLeaveShowHandler);

		return () => {
			elShow.removeEventListener("mouseenter", mouseEnterShowHandler);
			elShow.removeEventListener("mouseleave", mouseLeaveShowHandler);
		};
	}, [showRef, ref, isActive]);

	return [isActive, setIsActive];
};
export default useHover;
