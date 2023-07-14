import PropTypes from "prop-types";
import { useReducer, useRef, useState } from "react";
import { FaCommentDollar } from "react-icons/fa";
import { omit } from "lodash";

import "@components/posts/post-interaction/PostInteraction.scss";
import { useDispatch, useSelector } from "react-redux";
import { reactionService } from "@services/api/reaction.service";
import useEffectOnce from "@hooks/useEffectOnce";
import { ReactionSocket } from "@services/socket/reaction.socket";
import ReactionIcon from "../reaction-icon/ReactionIcon";
import { socketService } from "@services/socket/socket.service";
import { PostUtils } from "@services/utils/post.utils";
import PostReactionIcon from "@components/posts/PostReaction-icon/PostReactionIcon";
import PostReactionSelector from "@components/posts/postReaction-selector/PostReactionSelector";
import useHover from "@hooks/useHover";
import useClickOutside from "@hooks/useClickOutside";
import TextAreaInput from "@components/textAreaInput/TextAreaInput";
import { commentService } from "@services/api/comment.service";
import { openModal } from "@store/reducers/postModelReducer";
import PostComment from "../postComment/PostComment";
import LoadingWrapper from "@components/loading-wrapper/LoadingWrapper";

const postReactionReducer = (state, action) => {
	if (action.type === "ADD_REACTION") {
		const { type } = action.payload;
		state[type]++;
		state.reactionsCount++;

		return { ...state };
	}
	if (action.type === "UPDATE_REACTION") {
		const { type, prevType } = action.payload;
		state[type]++;
		state[prevType]--;
		return { ...state };
	}
	if (action.type === "DELETE_REACTION") {
		const { type } = action.payload;
		state[type]--;
		state.reactionsCount--;

		return { ...state };
	}
};

function PostInteraction({ post, editable, showComment }) {
	const { _id: postId, reactions } = post;

	const [commentsCount, setCommentsCount] = useState(post.commentsCount);
	const dispatch = useDispatch();
	const { profilePicture, username } = useSelector(
		(state) => state.user.profile
	);
	const postReactionInitState = PostUtils.getPostReactionInitState(reactions);
	const [postReaction, dispatchPostReaction] = useReducer(
		postReactionReducer,
		postReactionInitState
	);

	const [currentReaction, setCurrentReaction] = useState();
	const actionReactionRef = useRef();
	const postReactionSelectorRef = useRef();
	const [showReactionSelector, setShowReactionSelector] = useHover(
		actionReactionRef,
		postReactionSelectorRef
	);
	const commentRef = useRef();
	const [showCommentInput, setShowCommentInput] = useClickOutside(commentRef);
	const [showUpdateCommentInput, setShowUpdateCommentInput] =
		useClickOutside(commentRef);

	useEffectOnce(async () => {
		ReactionSocket.listen(postId, dispatchPostReaction, setCommentsCount);
		try {
			const response = await reactionService.getReactionByPostIdAndUsername(
				postId,
				username
			);
			if (!response.ok) throw new Error("Failed to load reaction by username.");

			const resData = await response.json();
			setCurrentReaction(resData.data.reactionData?.type);
		} catch (err) {
			console.log("get reaction by username error", err);
		}
	});

	const displayCommentClickHandler = () => {
		dispatch(
			openModal({
				post: {
					...post,
					commentsCount,
					reactions: omit({ ...postReaction }, "reactionsCount"),
				},
				editable,
			})
		);
	};

	const postCommentSubmitHandler = async (comment) => {
		if (showUpdateCommentInput) {
			const commentData = { ...showUpdateCommentInput, comment };
			await commentService.updateComment(commentData);
			setShowUpdateCommentInput(false);
		}

		if (showCommentInput) {
			await commentService.addComment(postId, comment);
			setShowCommentInput(false);
		}
	};

	const actionCommentClickHandler = () => {
		setShowCommentInput(true);
	};

	const reactionClickHandler = async (event) => {
		const clickedEl =
			event.target.closest(".reaction-select-item") ||
			event.target.closest(".post-interaction-action-reaction");

		if (!clickedEl) return;
		setShowReactionSelector(false);
		const clickedReaction = clickedEl.dataset.reaction;

		const body = {
			username,
			postId,
			type: clickedReaction || "rocket",
			profilePicture,
		};

		try {
			if (!currentReaction) {
				setCurrentReaction(body.type);
				await reactionService.addReactionByPostId(body);
				socketService.socket.emit("reaction", {
					...body,
					status: "ADD_REACTION",
				});
				return;
			}

			if (currentReaction === clickedReaction) {
				setCurrentReaction();
				await reactionService.deleteReactionByPostId(postId);
				socketService.socket.emit("reaction", {
					...body,
					status: "DELETE_REACTION",
				});
				return;
			}

			setCurrentReaction(body.type);
			await reactionService.updateReactionByPostId(body);
			socketService.socket.emit("reaction", {
				...body,
				prevType: currentReaction,
				status: "UPDATE_REACTION",
			});
		} catch (err) {
			console.log("add reaction error", err);
		}
	};

	return (
		<div className="post-interaction-container">
			<div className="post-interaction-display">
				<div className="post-interaction-display-reaction">
					<PostReactionIcon postReaction={postReaction} />
				</div>
				<div
					className="post-interaction-display-comment"
					onClick={displayCommentClickHandler}
				>
					{commentsCount ? <p>{commentsCount} comments</p> : null}
				</div>
			</div>
			<hr />
			<div className="post-interaction-action">
				{showReactionSelector && (
					<PostReactionSelector
						onClick={reactionClickHandler}
						ref={postReactionSelectorRef}
					/>
				)}
				<div
					className="post-interaction-action-reaction item"
					onClick={reactionClickHandler}
					data-reaction={currentReaction}
					ref={actionReactionRef}
				>
					<ReactionIcon currentReaction={currentReaction} />
				</div>
				<div
					className={`post-interaction-action-comment item ${
						showCommentInput ? "active" : ""
					}`}
					onClick={actionCommentClickHandler}
				>
					<FaCommentDollar className="icon" />
				</div>
			</div>
			{showComment && <hr />}
			{showComment && (
				<LoadingWrapper
					postId={postId}
					commentsCount={commentsCount}
					setShowUpdateCommentInput={setShowUpdateCommentInput}
				>
					<PostComment />
				</LoadingWrapper>
			)}
			{(showCommentInput || showUpdateCommentInput) && <hr />}
			{showCommentInput && !showComment && (
				<div
					className={`post-interaction-comment-input ${
						showComment ? "modal-emoji-position" : ""
					}`}
					ref={commentRef}
				>
					<TextAreaInput onSubmit={postCommentSubmitHandler} />
				</div>
			)}

			{showCommentInput && showComment && (
				<div
					className={`post-interaction-comment-input ${
						showComment ? "modal-emoji-position" : ""
					}`}
					ref={commentRef}
				>
					<TextAreaInput
						onSubmit={postCommentSubmitHandler}
						emojiPickerStyle={{
							position: "fixed",
							left: "70%",
							top: "40%",
						}}
					/>
				</div>
			)}

			{showUpdateCommentInput && showComment && (
				<div
					className={`post-interaction-comment-input ${
						showComment ? "modal-emoji-position" : ""
					}`}
					ref={commentRef}
				>
					<TextAreaInput
						value={showUpdateCommentInput.comment}
						onSubmit={postCommentSubmitHandler}
					/>
				</div>
			)}
		</div>
	);
}

PostInteraction.propTypes = {
	post: PropTypes.object,
	editable: PropTypes.bool,
	showComment: PropTypes.bool,
};

PostInteraction.defaultProps = {
	showComment: false,
};

export default PostInteraction;
