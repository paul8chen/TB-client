export default class BaseService {
	route;

	headers = {
		"content-type": "application/json",
	};

	credentials = "include";

	constructor(route) {
		this.route = route;
	}

	postData = (url, body) => {
		return fetch(
			`${process.env.REACT_APP_SERVER_BASE_URL}${this.route}${url}`,
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: this.headers,
				credentials: this.credentials,
			}
		);
	};

	getData = (url) =>
		fetch(`${process.env.REACT_APP_SERVER_BASE_URL}${this.route}${url}`, {
			headers: this.headers,
			credentials: this.credentials,
		});
}
