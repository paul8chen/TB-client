import { configureStore } from "@reduxjs/toolkit";

import userReducer from "@store/reducers/userReducer";
import addedPostReducer from "@store/reducers/addedPostReducer";
import notificationReducer from "@store/reducers/notificationReducer";
import postModalReducer from "@store/reducers/postModelReducer";
import chartReducer from "@store/reducers/chartReducer";
import chartPanelReducer from "./reducers/chartPanelReducer";

export const store = configureStore({
	reducer: {
		user: userReducer,
		addedPost: addedPostReducer,
		notification: notificationReducer,
		postModal: postModalReducer,
		chart: chartReducer,
		chartPanel: chartPanelReducer,
	},
});
