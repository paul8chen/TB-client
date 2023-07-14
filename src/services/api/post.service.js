import BaseService from "@services/api/BaseService";

class PostService extends BaseService {
	constructor() {
		super("/post");
	}

	createPost(data) {
		return this.postData("/create-post", data, "POST");
	}

	getPost(page) {
		return this.getData(`/get-post/${page}`);
	}

	getSinglePost(postId) {
		return this.getData(`/get-post-single/${postId}`);
	}

	deletePost(postId) {
		return this.postData(`/delete-post/${postId}`, null, "DELETE");
	}
}

export const postService = new PostService();
