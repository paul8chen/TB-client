import { socketService } from "@services/socket/socket.service";
import {
	addNotification,
	removeNotification,
} from "@store/reducers/notificationReducer";

export class NotificationSocket {
	static listen(dispatch) {
		socketService?.socket?.on("addNotification", (notification) => {
			dispatch(addNotification({ notification }));
		});

		socketService?.socket?.on("updateNotification", (notificationId) => {
			setTimeout(() => {
				dispatch(removeNotification({ notificationId }));
			}, 500);
		});
	}
}
