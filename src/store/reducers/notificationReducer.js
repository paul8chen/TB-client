import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	notifications: [],
	newNotification: false,
};

const notificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		getNotification: (state, action) => {
			const { notifications } = action.payload;
			state.notifications = notifications;
			state.newNotification = notifications.length > 0;
		},

		addNotification: (state, action) => {
			const { notification } = action.payload;
			state.notifications.unshift(notification);
			state.newNotification = true;
		},

		removeNotification: (state, action) => {
			const { notificationId } = action.payload;
			const indexOfnotificationId = state.notifications.findIndex(
				(notification) => notification._id === notificationId
			);
			state.notifications.splice(indexOfnotificationId, 1);

			state.newNotification = state.notifications.length > 0;
		},
	},
});

export const { getNotification, addNotification, removeNotification } =
	notificationSlice.actions;
export default notificationSlice.reducer;
