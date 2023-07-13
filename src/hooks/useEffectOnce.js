import { useRef, useEffect } from "react";

const useEffectOnce = (callback) => {
	const calledRef = useRef(false);

	useEffect(() => {
		if (!calledRef.current) {
			callback();
			calledRef.current = true;
		}
	}, [callback, calledRef]);
};
export default useEffectOnce;
