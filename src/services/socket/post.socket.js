import { socketService } from "@services/socket/socket.service";

export class PostSocket {
	static listen(setPosts, setTotalPost) {
		socketService?.socket?.on("addPost", (post) => {
			setPosts((prev) => [post, ...prev]);
		});

		socketService?.socket?.on("updatePost", (post) => {
			setPosts((prev) => [post, ...PostSocket.removedPostById(prev, post._id)]);
			console.log("post updated");
		});

		socketService?.socket?.on("deletePost", (postId) => {
			setPosts((prev) => [...PostSocket.removedPostById(prev, postId)]);
			setTotalPost((prev) => prev - 1);
		});
	}

	static removedPostById(posts, id) {
		posts.splice(
			posts.findIndex((post) => post._id === id),
			1
		);
		return posts;
	}
}
