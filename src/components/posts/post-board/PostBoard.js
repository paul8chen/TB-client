import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";

import "@components/posts/post-board/PostBoard.scss";
import PostCard from "../post-card/PostCard";
import useEffectOnce from "@hooks/useEffectOnce";
import { PostSocket } from "@services/socket/post.socket";
import Spinner from "@components/spinner/Spinner";
import { postService } from "@services/api/post.service";
import { PostUtils } from "@services/utils/post.utils";

const PostBoard = ({ postData, postsCount }) => {
	const { profile } = useSelector((state) => state.user);
	const [totalPost, setTotalPost] = useState(postsCount);
	const [posts, setPosts] = useState(postData);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const bodyRef = useRef();
	const bottomRef = useRef();

	const lastPage = PostUtils.getLastPage(totalPost);

	useEffectOnce(() => {
		PostSocket.listen(setPosts, setTotalPost);
	});

	const loadNextPostData = async () => {
		try {
			const response = await postService.getPost(currentPage + 1);
			const resData = await response.json();
			const { posts: nextPosts } = resData.data;
			setPosts((state) => [...state, ...nextPosts]);
			setCurrentPage((state) => state + 1);
		} catch (err) {
			console.log("loadNextPostData", err);
		}
	};

	const postCardContainerOnScrollHandler = async () => {
		const containerHeight = bodyRef.current.getBoundingClientRect().height;
		const bottomLineTop = bottomRef.current?.getBoundingClientRect().top;

		if (bottomLineTop < containerHeight) {
			setIsLoading(true);
			await loadNextPostData();
			setIsLoading(false);
		}
	};

	return (
		<div
			className="post-card-container scroll"
			ref={bodyRef}
			onScroll={
				currentPage < lastPage ? postCardContainerOnScrollHandler : null
			}
		>
			{posts.map((post) => (
				<PostCard
					post={post}
					key={post._id}
					editable={post.username === profile.username}
				/>
			))}

			{!isLoading && (
				<div className={`post-card-container-bottom `} ref={bottomRef} />
			)}

			{isLoading && (
				<div className="post-card-container-spinner">
					<Spinner />
				</div>
			)}
		</div>
	);
};

PostBoard.propTypes = {
	postData: PropTypes.array,
	postsCount: PropTypes.number,
};

PostBoard.defaultProps = {
	postData: [],
};

export default PostBoard;
