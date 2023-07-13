import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isOpen: false,
	isEditable: false,
	post: null,
};

const postModelSlice = createSlice({
	name: "postModel",
	initialState,
	reducers: {
		openModal: (state, action) => {
			const { post, editable } = action.payload;
			state.isOpen = true;
			state.post = post;
			state.isEditable = editable;
		},

		closeModal: (state) => {
			state.isOpen = false;
			state.isEditable = false;
			state.profile = null;
		},
	},
});

export const { openModal, closeModal } = postModelSlice.actions;
export default postModelSlice.reducer;
