import { useEffect, useState } from "react";

const useClickOutside = (ref) => {
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		const onClick = (event) => {
			if (ref.current !== null && !ref.current.contains(event.target)) {
				setIsActive((prev) => !prev);
			}
		};

		if (isActive) {
			window.addEventListener("mousedown", onClick);
		}

		return () => {
			window.removeEventListener("mousedown", onClick);
		};
	}, [isActive, ref]);

	return [isActive, setIsActive];
};
export default useClickOutside;
