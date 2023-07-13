import PropTypes from "prop-types";
import { useRef, useEffect } from "react";
import { HiOutlineTrash } from "react-icons/hi";

import "@components/bulletin-item/BulletinItem.scss";
import useClickOutside from "@hooks/useClickOutside";
import BulletinInput from "@components/bulletin-input/BulletinInput";
import { useDispatch } from "react-redux";
import {
	removeWatchList,
	updateWatchList,
} from "@store/reducers/addedPostReducer";

function BulletinItem({ bulletinName, count, isActive, isOnly, onClick }) {
	const dispatch = useDispatch();
	const bulletinInputRef = useRef();
	const [textIsClicked, setTextIsClicked] = useClickOutside(bulletinInputRef);

	const textDBLClickHandler = () => {
		setTextIsClicked(true);
	};

	const iconClickHandler = () => {
		dispatch(removeWatchList({ watchListName: bulletinName }));
	};

	useEffect(() => {
		if (textIsClicked) bulletinInputRef.current.focus();
	}, [textIsClicked]);

	const bulletinInputSubmitHandler = (event) => {
		event.preventDefault();

		dispatch(
			updateWatchList({
				watchListName: bulletinName,
				updatedWatchListName: bulletinInputRef.current.value,
			})
		);
		setTextIsClicked(false);
	};

	return (
		<div
			className={`bulletin-item ${isActive ? "active" : null}`}
			data-bulletin-name={bulletinName}
			onClick={onClick.bind(this, bulletinName, isActive)}
		>
			<div className="item-name">
				{!textIsClicked && (
					<div className="text" onDoubleClick={textDBLClickHandler}>
						{bulletinName}
					</div>
				)}
				{textIsClicked && (
					<BulletinInput
						ref={bulletinInputRef}
						onSubmit={bulletinInputSubmitHandler}
					/>
				)}
			</div>
			<div className="item-count">{count}</div>
			{!isOnly && (
				<div className="item-icon" onClick={iconClickHandler}>
					<HiOutlineTrash className="icon" />
				</div>
			)}
		</div>
	);
}

BulletinItem.propTypes = {
	bulletinName: PropTypes.string,
	count: PropTypes.number,
	isActive: PropTypes.bool,
	isOnly: PropTypes.bool,
	onClick: PropTypes.func,
};

BulletinItem.defaultProps = {
	bulletinName: "",
	onClick: () => {},
};

export default BulletinItem;
