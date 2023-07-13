import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaCaretUp, FaRegBell, FaSearchDollar } from "react-icons/fa";
import { TbColumns } from "react-icons/tb";

import "@components/header/Header.scss";
import ProfilePic from "@components/profile-pic/ProfilePic";
import Bulletin from "@components/bulletin/Bulletin";
import useClickOutside from "@hooks/useClickOutside";
import { setCurrentWatchList } from "@store/reducers/addedPostReducer";
import Notification from "@components/notification/Notification";
import Logout from "@components/logout/Logout";
import useEffectOnce from "@hooks/useEffectOnce";
import { NotificationSocket } from "@services/socket/notification.socket";
import { notificationService } from "@services/api/Notification.service";
import { getNotification } from "@store/reducers/notificationReducer";

const Header = () => {
	const dispatch = useDispatch();
	const { profile } = useSelector((state) => state.user);
	const bulletinRef = useRef();
	const notificationRef = useRef();
	const profileRef = useRef();
	const [isBulletinActive, setIsBulletinActive] = useClickOutside(bulletinRef);
	const [isBulletinLeaving, setIsBulletinLeaving] = useState();
	const [isNotificationActive, setIsNotificationActive] =
		useClickOutside(notificationRef);
	const [isProfileActive, setIsProfileActive] = useClickOutside(profileRef);
	const { notifications: notificationData, newNotification } = useSelector(
		(state) => state.notification
	);

	const fetchNotifications = async () => {
		try {
			const response = await notificationService.getNotification();
			const responseData = await response.json();
			const notifications = responseData.data.notificationData;
			dispatch(getNotification({ notifications }));
		} catch (err) {
			console.log("fatch notification error", err);
		}
	};

	useEffectOnce(() => {
		NotificationSocket.listen(dispatch);
		fetchNotifications();
	});

	const profileClickHandler = () => {
		setIsProfileActive(true);
	};

	const notificationClickHandler = () => {
		setIsNotificationActive((prev) => !prev);
	};

	const bulletinClickHandler = () => {
		setIsBulletinActive((prev) => !prev);
		setIsBulletinLeaving(true);
	};

	const bulletinItemClickHandler = (currentWatchList, isActive) => {
		if (isActive) return;

		dispatch(setCurrentWatchList({ currentWatchList }));
		setIsBulletinActive(false);
	};

	useEffect(() => {
		if (isBulletinLeaving && !isBulletinActive) {
			const isBulletinLeavingTimeout = setTimeout(() => {
				setIsBulletinLeaving(false);
			}, 1500);

			return () => {
				clearTimeout(isBulletinLeavingTimeout);
			};
		}
	}, [isBulletinLeaving, isBulletinActive]);

	return (
		<>
			<div className="header-container">
				<div
					ref={bulletinRef}
					className={`header-bulletin ${isBulletinActive ? "enter" : ""} ${
						!isBulletinActive && isBulletinLeaving ? "leaving" : ""
					} `}
				>
					<Bulletin onBulletinItemClick={bulletinItemClickHandler} />
				</div>

				<div className="header-navbar">
					<div className="header-app">
						<FaSearchDollar className="icon" />
						<div className="app-name">BackTester</div>
					</div>

					<div className="header-nav">
						<div className="header-nav-item" onClick={notificationClickHandler}>
							<div
								className={`nav-item-icon ${
									isNotificationActive ? "active" : ""
								}`}
							>
								<FaRegBell className="icon" />
								{newNotification && (
									<span className="notification-dots dots"></span>
								)}
							</div>
						</div>

						<div className="header-nav-item">
							<div
								className={`nav-item-icon ${isBulletinActive ? "active" : ""}`}
								onClick={bulletinClickHandler}
							>
								<TbColumns className="icon" />
							</div>
							<div className="nav-item-notification" ref={notificationRef}>
								{isNotificationActive && (
									<Notification data={notificationData} />
								)}
							</div>
						</div>

						<div className="header-nav-profile">
							<div className="profile-image">
								{profile?.profilePicture ? (
									<ProfilePic
										src={profile.profilePicture}
										className="profile-img"
									/>
								) : (
									<ProfilePic className="profile-img" />
								)}
							</div>
							<div
								className={`nav-profile-icon ${
									isProfileActive ? "active" : ""
								}`}
								onClick={profileClickHandler}
							>
								<span className=" profile-name">
									{profile?.username || "GUEST"}
									<FaCaretUp className="icon" />
								</span>
							</div>
							<div
								className={`nav-profile-dropdown ${
									isProfileActive ? "active" : ""
								}`}
								ref={profileRef}
							>
								<Logout />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Header;
