import React from "react";
import { RouterProvider } from "react-router-dom";

import { AppRouter } from "@root/routes";

const App = () => {
	return <RouterProvider router={AppRouter} />;
};

export default App;
