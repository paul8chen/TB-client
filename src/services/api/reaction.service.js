import BaseService from "@services/api/BaseService";

class ReactionService extends BaseService {
	constructor() {
		super("/reaction");
	}

	getReactionByPostId(postId) {
		return this.getData(`/get-reactions/${postId}`);
	}

	getReactionByPostIdAndUsername(postId, username) {
		return this.getData(`/get-reaction/${postId}/${username}`);
	}

	addReactionByPostId(body) {
		return this.postData("/add-reaction", body);
	}

	updateReactionByPostId(body) {
		return this.postData(`/update-reaction`, body, "PUT");
	}

	deleteReactionByPostId(postId) {
		return this.postData(`/delete-reaction/${postId}`, null, "DELETE");
	}
}

export const reactionService = new ReactionService();
