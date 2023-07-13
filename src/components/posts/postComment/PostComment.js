import { useRef, useState, useReducer } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";

import "@components/posts/postComment/PostComment.scss";
import { commentService } from "@services/api/comment.service";
import useEffectOnce from "@hooks/useEffectOnce";
import Spinner from "@components/spinner/Spinner";
import { PostUtils } from "@services/utils/post.utils";
import { CommentSocket } from "@services/socket/comment.socket";
import PostCommentItem from "../postComment-item/PostCommentItem";
import { useSelector } from "react-redux";

const postCommentInitState = {
	comments: [],
};

const postCommentReducer = (state, action) => {
	if (action.type === "ADD_COMMENT") {
		const { commentData } = action.payload;
		console.log("added-reducer");
		return {
			comments: [...state.comments, commentData],
		};
	}
	if (action.type === "UPDATE_COMMENT") {
		const { commentData } = action.payload;
		const returnedComments = cloneDeep(state.comments);
		const updatedCommentIndex = returnedComments.findIndex(
			(comment) => comment._id === commentData._id
		);
		returnedComments.splice(updatedCommentIndex, 1, commentData);

		return { comments: returnedComments };
	}
	if (action.type === "DELETE_COMMENT") {
		console.log("deleted");
		const { _id } = action.payload.commentData;
		const returnedComments = cloneDeep(state.comments);
		const updatedCommentIndex = returnedComments.findIndex(
			(comment) => comment._id === _id
		);
		returnedComments.splice(updatedCommentIndex, 1);

		return {
			comments: returnedComments,
		};
	}

	if (action.type === "LOAD_COMMENTS") {
		const { commentDatas } = action.payload;

		return {
			comments: [...state.comments, ...commentDatas],
		};
	}
};

function PostComment({
	postId,
	setIsInitLoading,
	commentsCount,
	setShowUpdateCommentInput,
}) {
	const bodyRef = useRef();
	const bottomRef = useRef();
	const [isLoading, setIsLoading] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const lastPage = PostUtils.getLastPage(commentsCount);
	const [postComment, dispatchPostComment] = useReducer(
		postCommentReducer,
		postCommentInitState
	);
	const { username } = useSelector((state) => state.user.profile);

	const loadPostComments = async (currentPage) => {
		try {
			const waiting = new Promise((resolve) =>
				setTimeout(() => {
					resolve();
				}, 3000)
			);

			await waiting;
			const response = await commentService.getComments(postId, currentPage);

			const resData = await response.json();

			const { commentDatas } = resData.data;
			console.log("commentDatas from SERVER", commentDatas);
			dispatchPostComment({ type: "LOAD_COMMENTS", payload: { commentDatas } });
		} catch (err) {
			console.log("load comments error", err);
		} finally {
			setIsInitLoading(false);
		}
	};

	const postCommentContainerOnScrollHandler = async () => {
		const containerBottom =
			bodyRef.current.getBoundingClientRect().top +
			bodyRef.current.offsetHeight;
		const bottomLineTop = bottomRef.current?.getBoundingClientRect().top;

		if (bottomLineTop < containerBottom) {
			console.log("load comment");
			setIsLoading(true);
			setCurrentPage((state) => state + 1);
			await loadPostComments(currentPage + 1);
			setIsLoading(false);
		}
	};

	useEffectOnce(async () => {
		CommentSocket.listen(postId, dispatchPostComment);
		await loadPostComments(1);
	});

	return (
		<div
			className="post-comment-container scroll"
			ref={bodyRef}
			onScroll={
				currentPage < lastPage ? postCommentContainerOnScrollHandler : null
			}
		>
			{postComment.comments.map((comment) => (
				<PostCommentItem
					commentData={comment}
					key={comment._id}
					editable={username === comment.username}
					setShowUpdateCommentInput={setShowUpdateCommentInput}
				/>
			))}

			{!isLoading && (
				<div className="post-comment-container-bottom" ref={bottomRef} />
			)}
			{isLoading && (
				<div className="post-comment-container-spinner">
					<Spinner />
				</div>
			)}
		</div>
	);
}

PostComment.propTypes = {
	postId: PropTypes.string,
	setIsInitLoading: PropTypes.func,
	commentsCount: PropTypes.number,
	editable: PropTypes.bool,
	setShowUpdateCommentInput: PropTypes.func,
};

PostComment.defaultProps = {
	setIsInitLoading: () => {},
	editable: false,
};
export default PostComment;
