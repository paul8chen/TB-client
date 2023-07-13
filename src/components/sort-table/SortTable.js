import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "@components/sort-table/SortTable.scss";
import SortItem from "@components/sort-item/SortItem";
import useEffectOnce from "@hooks/useEffectOnce";
import { postService } from "@services/api/post.service";
import { getAddedPost } from "@store/reducers/addedPostReducer";

const SortTable = () => {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(null);
	const dispatch = useDispatch();
	const { addedPosts, currentWatchList } = useSelector(
		(state) => state.addedPost
	);

	useEffectOnce(() => {
		dispatch(getAddedPost());
	});

	const loadData = async () => {
		setIsLoading(true);

		let res;
		try {
			res = await postService.getPost(1);
		} catch (err) {
			setIsError(err.message);
			return;
		}
		const resData = await res.json();
		setIsLoading(false);
		setData(resData.data.posts);
	};

	useEffectOnce(loadData);

	return (
		<div className="sort-table-container">
			<div className="sort-table-header">
				<div className="sort-table-title-text">Most xxx posts</div>
			</div>

			<div className="sort-table-posts-container">
				<div className="sort-table-posts scroll">
					{data && !isLoading && !isError
						? data.map((post) => (
								<SortItem
									key={post._id}
									post={post.post}
									postId={post._id}
									isAddedInit={addedPosts[currentWatchList].includes(post._id)}
									currentWatchList={currentWatchList}
								/>
						  ))
						: null}
					{isError && <div className="alerts alert-error">{isError}</div>}
				</div>
			</div>
		</div>
	);
};

export default SortTable;
