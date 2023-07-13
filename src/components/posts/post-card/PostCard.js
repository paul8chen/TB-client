import { useRef } from "react";
import PropTypes from "prop-types";
import ReactTimeAgo from "react-time-ago";
import { GoClock } from "react-icons/go";
import { SlOptionsVertical } from "react-icons/sl";
import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit2 } from "react-icons/fi";

import "@components/posts/post-card/PostCard.scss";
import "@services/utils/time-ago";
import ProfilePic from "@components/profile-pic/ProfilePic";
import { PostUtils } from "@services/utils/post.utils";
import useClickOutside from "@hooks/useClickOutside";
import { postService } from "@services/api/post.service";
import PostInteraction from "@components/posts/post-interaction/PostInteraction";
// import useEffectOnce from "@hooks/useEffectOnce";

const PostCard = ({ post, editable, showComment }) => {
	const editableRef = useRef();
	const [isEditClick, setIsEditClick] = useClickOutside(editableRef);

	// const reLoadPostData = async () => {
	// 	if (!showComment) return;

	// 	try {
	// 		const response = await postService.getSinglePost(post._id);
	// 		const resData = await response.json();
	// 		const { postData } = resData.data;
	// 		console.log("postData", postData);
	// 		setPostData(postData);
	// 	} catch (err) {
	// 		console.log("reload postdata error", err);
	// 	}
	// };

	// useEffectOnce(reLoadPostData);

	const editableClickHandler = () => {
		setIsEditClick(true);
	};

	const deleteClickHandler = async (event) => {
		await postService.deletePost(post._id);
		event.target.closest(".post-card").classList.add("removed");
	};

	return (
		<div className="post-card">
			<div className="post-card-head">
				<div className="post-card-head-profile">
					<div className="post-card-head-profile-img">
						<ProfilePic src={post.profileImage} />
					</div>
					<div className="post-card-head-profile-username">
						<p>{post.username}</p>
						<div className="post-card-head-profile-username-time">
							<GoClock />
							<ReactTimeAgo
								date={new Date(post.createdAt)}
								locale="en-US"
								timeStyle="twitter"
							/>
						</div>
					</div>
				</div>
				<div className="post-card-head-editable" ref={editableRef}>
					{isEditClick && (
						<div className="post-card-head-editable-option">
							<HiOutlineTrash
								className="post-card-head-editable-option-delete"
								onClick={deleteClickHandler}
							/>
							<FiEdit2 className="post-card-head-editable-option-update" />
						</div>
					)}
					{editable && (
						<div
							className={`clickable-icon-div ${isEditClick ? "active" : ""}`}
							onClick={editableClickHandler}
						>
							<SlOptionsVertical className="clickable-icon" />
						</div>
					)}
				</div>
			</div>
			<div className="post-card-body">
				<div className="post-card-body-post">
					<div className="post-card-body-post-text">
						<p>{post.post}</p>
					</div>
					<div className="post-card-body-post-img">
						<img
							src={PostUtils.getImgFromCloudinary(post.imgVersion, post.imgId)}
							alt="post img"
						/>
					</div>
				</div>
			</div>
			<div className="post-card-footer">
				<PostInteraction
					post={post}
					editable={editable}
					showComment={showComment}
				/>
			</div>
		</div>
	);
};
PostCard.propTypes = {
	post: PropTypes.object.isRequired,
	editable: PropTypes.bool,
	showComment: PropTypes.bool,
};

PostCard.defaultProps = {
	showComment: PropTypes.false,
	editable: PropTypes.false,
};
export default PostCard;
