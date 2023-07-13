import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "@root/index.scss";
import App from "@root/App";
import { store } from "@store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<App />
	</Provider>
);
