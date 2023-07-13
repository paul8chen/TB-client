import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { AppRouter } from "@root/routes";
import { socketService } from "@services/socket/socket.service";

const App = () => {
	useEffect(() => {
		socketService.connect();
	}, []);

	return <RouterProvider router={AppRouter} />;
};

export default App;
