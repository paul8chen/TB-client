import BaseService from "@services/api/BaseService";

class UserService extends BaseService {
	constructor() {
		super("/user");
	}

	currentUser() {
		return this.getData("/currentUser");
	}
}

export const userService = new UserService();
