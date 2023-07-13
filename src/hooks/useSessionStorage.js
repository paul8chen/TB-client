const useSessionStorage = (key) => {
	const item = sessionStorage.getItem(key) || "";

	const setValue = (value) => {
		sessionStorage.setItem(key, JSON.stringify(value));
	};

	const deleteValue = () => {
		sessionStorage.removeItem(key);
	};

	return [item, setValue, deleteValue];
};

export default useSessionStorage;
