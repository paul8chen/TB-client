import BaseService from "@services/api/BaseService";

class CommentService extends BaseService {
	constructor() {
		super("/comment");
	}

	getComments(postId, page) {
		return this.getData(`/all-comments/${postId}/${page}`);
	}

	addComment(postId, comment) {
		return this.postData("/create-comment", { postId, comment });
	}

	updateComment(commentData) {
		return this.postData("/update-comment", commentData, "PATCH");
	}

	deleteComment(commentData) {
		return this.postData("/delete-comment", commentData, "DELETE");
	}
}

export const commentService = new CommentService();
