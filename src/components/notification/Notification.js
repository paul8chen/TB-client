import PropTypes from "prop-types";
import ReactTimeAgo from "react-time-ago";

import "@components/notification/Notification.scss";
import "@services/utils/time-ago";
import ProfilePic from "@components/profile-pic/ProfilePic";
import { notificationService } from "@services/api/Notification.service";

const Notification = ({ data }) => {
	const notificationItemClickHandler = async (notificationId, event) => {
		try {
			event.target.closest(".notification-item").classList.add("removed");
			console.log(event.target.closest(".notification-item").classList);
			await notificationService.markNotificationRead(notificationId);
		} catch (err) {
			console.log("notification mark as read error", err);
		}
	};

	return (
		<div className="notification-container">
			<div className="notification-head">
				<h5>
					Notification
					<span className="notification-count">{data.length}</span>
				</h5>
			</div>

			<div className="notification-body scroll">
				{data.map((notification) => (
					<div
						className={`notification-item ${
							notification.notificationType === "reaction" ? "reaction" : ""
						}`}
						key={notification._id}
						onClick={notificationItemClickHandler.bind(this, notification._id)}
					>
						<ProfilePic
							src={notification.profilePicture}
							className="notification-pic"
						/>
						<div className="notification-text">
							<p>{notification.message}</p>
							<span>
								<ReactTimeAgo
									date={new Date(notification.createdAt)}
									locale="en-US"
									timeStyle="twitter"
								/>
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

Notification.propTypes = {
	data: PropTypes.array,
};

export default Notification;
