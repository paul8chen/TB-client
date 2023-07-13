import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import "@components/sort-item/SortItem.scss";
import ProfilePic from "@components/profile-pic/ProfilePic";
import Button from "@components/button/Button";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

import {
	addaddedPost,
	removeaddedPost,
} from "@store/reducers/addedPostReducer";

function SortItem({ src, post, postId, isAddedInit, currentWatchList }) {
	const [isAdded, setIsAdded] = useState(isAddedInit);
	const dispatch = useDispatch();

	useEffect(() => {
		setIsAdded(isAddedInit);
	}, [setIsAdded, isAddedInit]);

	const buttonClickHandler = (event) => {
		event.preventDefault();

		!isAdded &&
			dispatch(addaddedPost({ watchListName: currentWatchList, postId }));

		isAdded &&
			dispatch(removeaddedPost({ watchListName: currentWatchList, postId }));

		setIsAdded((prev) => !prev);
	};

	return (
		<div className="sort-table-post">
			<div className="post-image">
				<ProfilePic src={src} />
			</div>
			<div className="post-title">{post}</div>
			<div className="post-add-favorite">
				<Button
					text="add"
					className="button favorite-btn"
					onClick={buttonClickHandler}
				>
					<>
						{isAdded && <AiFillStar className="icon" />}
						{!isAdded && <AiOutlineStar className="icon" />}
					</>
				</Button>
			</div>
		</div>
	);
}

SortItem.propTypes = {
	src: PropTypes.string,
	post: PropTypes.string,
	postId: PropTypes.string,
	isAddedInit: PropTypes.bool,
	currentWatchList: PropTypes.string,
};

SortItem.defaultProps = {
	src: process.env.REACT_APP_PROFILE_PIC,
	post: "post",
};

export default SortItem;
