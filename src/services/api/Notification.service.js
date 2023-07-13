import BaseService from "@services/api/BaseService";

class NotificationService extends BaseService {
	constructor() {
		super("/notification");
	}

	markNotificationRead(notificationId) {
		return this.postData(
			"/update-notification-read",
			{ notificationId },
			"PATCH"
		);
	}

	getNotification() {
		return this.getData("/get-notification");
	}
}

export const notificationService = new NotificationService();
