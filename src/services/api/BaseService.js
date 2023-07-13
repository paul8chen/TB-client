export default class BaseService {
	route;

	headers = {
		"content-type": "application/json",
	};

	credentials = "include";

	constructor(route) {
		this.route = route;
	}

	postData = (url, body, method) => {
		return fetch(
			`${process.env.REACT_APP_SERVER_BASE_URL}${process.env.REACT_APP_API_VERSION}${this.route}${url}`,
			{
				method: method || "POST",
				body: body ? JSON.stringify(body) : undefined,
				headers: this.headers,
				credentials: this.credentials,
			}
		);
	};

	getData = (url) =>
		fetch(
			`${process.env.REACT_APP_SERVER_BASE_URL}${process.env.REACT_APP_API_VERSION}${this.route}${url}`,
			{
				headers: this.headers,
				credentials: this.credentials,
			}
		);
}
