import { useEffect, useState } from "react";

const useInputInvalid = () => {
	const [invalidInput, setInvalidInput] = useState("");

	useEffect(() => {
		if (!invalidInput) return;

		const setInvalidInputTimer = setTimeout(() => {
			setInvalidInput("");
		}, +process.env.REACT_APP_INVALID_INPUT_DURATION_MS);

		return () => {
			clearTimeout(setInvalidInputTimer);
		};
	}, [invalidInput]);

	return [invalidInput, setInvalidInput];
};
export default useInputInvalid;
