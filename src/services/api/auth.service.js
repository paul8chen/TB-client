import BaseService from "./BaseService";

class AuthService extends BaseService {
	constructor() {
		super("/auth");
	}

	signup(body) {
		return this.postData("/signup", body);
	}

	login(body) {
		return this.postData("/login", body);
	}

	forgotPassword(body) {
		return this.postData("/forgot-password", body);
	}

	resetPassword(body, token) {
		return this.postData(`/reset-password?token=${token}`, body);
	}
}

export const authService = new AuthService();
