import PropTypes from "prop-types";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoAddOutline } from "react-icons/io5";

import "@components/bulletin/Bulletin.scss";
import BulletinItem from "@components/bulletin-item/BulletinItem";
import BulletinInput from "@components/bulletin-input/BulletinInput";
import { addWatchList } from "@store/reducers/addedPostReducer";
import useClickOutside from "@hooks/useClickOutside";

const Bulletin = ({ onBulletinItemClick }) => {
	const bulletinInputRef = useRef();
	const [isAddClicked, setIsAddClicked] = useClickOutside(bulletinInputRef);
	const dispatch = useDispatch();
	const { addedPosts, currentWatchList } = useSelector(
		(state) => state.addedPost
	);

	const bulletintRefHandler = (el) => {
		bulletinInputRef.current = el;
		el?.focus();
	};

	const addClickHandler = () => {
		setIsAddClicked(true);
	};

	const bulletinInputSubmitHandler = (event) => {
		event.preventDefault();

		const newWatchListName = bulletinInputRef.current.value;

		dispatch(addWatchList({ watchListName: newWatchListName }));
		setIsAddClicked(false);
	};

	return (
		<div className="bulletin-container">
			<div className="bulletin-header">
				<h5 className="header-text">Watch Lists</h5>
				<div className="header-icon" onClick={addClickHandler}>
					<IoAddOutline className="icon" />
				</div>
			</div>
			<div className="bulletin-body scroll">
				{isAddClicked && (
					<BulletinInput
						onSubmit={bulletinInputSubmitHandler}
						ref={bulletintRefHandler}
					/>
				)}
				{Object.keys(addedPosts).map((name, _, arr) => (
					<BulletinItem
						bulletinName={name}
						key={name}
						count={addedPosts[name].length}
						isActive={currentWatchList === name}
						isOnly={arr.length === 1}
						onClick={onBulletinItemClick}
					/>
				))}
			</div>
		</div>
	);
};

Bulletin.propTypes = {
	onBulletinItemClick: PropTypes.func,
};

Bulletin.defaultProps = {
	onBulletinItemClick: () => {},
};

export default Bulletin;
