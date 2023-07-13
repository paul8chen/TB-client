const useLocalStorage = (key, type) => {
	if (type === "get") {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : "";
	}

	if (type === "set") {
		const setValue = (value) => {
			localStorage.setItem(key, JSON.stringify(value));
		};
		return [setValue];
	}

	const deleteValue = () => {
		localStorage.removeItem(key);
	};

	return [deleteValue];
};

export default useLocalStorage;
