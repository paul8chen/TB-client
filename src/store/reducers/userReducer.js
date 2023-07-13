import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	token: "",
	profile: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		addUser: (state, action) => {
			const { token, profile } = action.payload;
			state.token = token;
			state.profile = profile;
		},

		removeUser: (state) => {
			state.token = "";
			state.profile = null;
		},
	},
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
