import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit2 } from "react-icons/fi";

import "@components/posts/postComment-item/PostCommentItem.scss";
import ProfilePic from "@components/profile-pic/ProfilePic";
import { commentService } from "@services/api/comment.service";
import useClickOutside from "@hooks/useClickOutside";

function PostCommentItem({ commentData, editable, setShowUpdateCommentInput }) {
	const { username, comment } = commentData;
	const editableRef = useRef();
	const [isEditClick, setIsEditClick] = useClickOutside(editableRef);
	const [isDeleted, setIsDeleted] = useState();

	const editableClickHandler = async () => {
		setIsEditClick(true);
	};

	const editableOptionClickHandler = async (event) => {
		const optionItemEl = event.target.closest(".editable-option-item");
		if (!optionItemEl) return;

		const { option } = optionItemEl.dataset;

		if (option === "update") return setShowUpdateCommentInput(commentData);

		try {
			option === "delete" && (await commentService.deleteComment(commentData));
			option === "delete" && setIsDeleted(true);
		} catch (err) {
			console.log("comment-edit error", err);
		} finally {
			setIsEditClick(false);
		}
	};

	return (
		<div className={`post-comment-item ${isDeleted ? "deleted" : ""}`}>
			<div className="post-comment-item-profile-pic">
				<ProfilePic />
			</div>
			<div className="post-comment-item-content">
				<p className="post-comment-item-content-username">{username}</p>
				<p className="post-comment-item-content-comment">{comment}</p>
			</div>
			<div className="post-comment-item-editable" ref={editableRef}>
				{isEditClick && (
					<div
						className="post-comment-item-editable-option"
						onClick={editableOptionClickHandler}
					>
						<HiOutlineTrash
							className="post-comment-item-editable-option-delete editable-option-item"
							data-option="delete"
						/>
						<FiEdit2
							className="post-comment-item-editable-option-update editable-option-item"
							data-option="update"
						/>
					</div>
				)}
				{editable && (
					<div
						className={`clickable-icon-div ${isEditClick ? "active" : ""}`}
						onClick={editableClickHandler}
					>
						<SlOptions className="clickable-icon" />
					</div>
				)}
			</div>
		</div>
	);
}

PostCommentItem.propTypes = {
	commentData: PropTypes.object,
	editable: PropTypes.bool,
	setShowUpdateCommentInput: PropTypes.func,
};

PostCommentItem.defaultProps = {
	editable: false,
};

export default PostCommentItem;
