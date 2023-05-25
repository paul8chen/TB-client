import React from "react";
import { RouterProvider } from "react-router-dom";

import "./App.scss";
import { AppRouter } from "./routes";

const App = () => {
	return <RouterProvider router={AppRouter} />;
};

export default App;
