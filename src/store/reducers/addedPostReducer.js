import { createSlice } from "@reduxjs/toolkit";
import { omit } from "lodash";

const initialState = {
	addedPosts: {},
	currentWatchList: "",
};

const addedPostSlice = createSlice({
	name: "addedPost",
	initialState,
	reducers: {
		getAddedPost: (state) => {
			const addedPosts = JSON.parse(localStorage.getItem("addedPost")) || {
				watchlist: [],
			};

			const currentWatchListLocal = localStorage.getItem("currentWatchList");
			const currentWatchList = addedPosts[currentWatchListLocal]
				? currentWatchListLocal
				: Object.keys(addedPosts).length
				? Object.keys(addedPosts)[0]
				: "";

			state.addedPosts = addedPosts;

			state.currentWatchList = currentWatchList;

			localStorage.setItem("addedPost", JSON.stringify(state.addedPosts));
			localStorage.setItem("currentWatchList", currentWatchList);
		},

		setCurrentWatchList: (state, action) => {
			const { currentWatchList } = action.payload;

			state.currentWatchList = currentWatchList;

			localStorage.setItem("currentWatchList", currentWatchList);
		},

		addWatchList: (state, action) => {
			const { watchListName } = action.payload;

			if (state.addedPosts[watchListName]) return;

			state.addedPosts[watchListName] = [];
			state.currentWatchList = watchListName;

			localStorage.setItem("addedPost", JSON.stringify(state.addedPosts));
			localStorage.setItem("currentWatchList", watchListName);
		},

		updateWatchList: (state, action) => {
			const { updatedWatchListName, watchListName } = action.payload;

			if (updatedWatchListName === watchListName) return;
			if (state.addedPosts[updatedWatchListName]) return;

			state.addedPosts[updatedWatchListName] = [
				...state.addedPosts[watchListName],
			];

			state.addedPosts = omit(state.addedPosts, [`${watchListName}`]);

			state.currentWatchList = updatedWatchListName;

			localStorage.setItem("addedPost", JSON.stringify(state.addedPosts));
			localStorage.setItem("currentWatchList", updatedWatchListName);
		},

		removeWatchList: (state, action) => {
			const { watchListName } = action.payload;

			state.addedPosts = omit(state.addedPosts, [`${watchListName}`]);

			if (watchListName === state.currentWatchList) {
				const replacedWatchListName = Object.keys(state.addedPosts).length
					? Object.keys(state.addedPosts)[0]
					: "";

				state.currentWatchList = replacedWatchListName;
				localStorage.setItem("currentWatchList", replacedWatchListName);
			}

			localStorage.setItem("addedPost", JSON.stringify(state.addedPosts));
		},

		addaddedPost: (state, action) => {
			const { watchListName, postId } = action.payload;

			state.addedPosts[watchListName].push(postId);

			localStorage.setItem("addedPost", JSON.stringify(state.addedPosts));
		},

		removeaddedPost: (state, action) => {
			const { watchListName, postId } = action.payload;

			state.addedPosts[watchListName].splice(
				state.addedPosts[watchListName].indexOf(postId),
				1
			);

			localStorage.setItem("addedPost", JSON.stringify(state.addedPosts));
		},
	},
});

export const {
	getAddedPost,
	addaddedPost,
	removeaddedPost,
	addWatchList,
	removeWatchList,
	updateWatchList,
	setCurrentWatchList,
} = addedPostSlice.actions;
export default addedPostSlice.reducer;
