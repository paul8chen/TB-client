import { socketService } from "@services/socket/socket.service";

export class CommentSocket {
	static listen(postId, commentDispatch) {
		socketService?.socket?.on("updateComment", (commentData) => {
			if (postId !== commentData.postId) return;

			commentDispatch({ type: "UPDATE_COMMENT", payload: { commentData } });
		});

		socketService?.socket?.on("deleteComment", (commentData) => {
			if (postId !== commentData.postId) return;

			// commentDispatch({ type: "DELETE_COMMENT", payload: { commentData } });
			setTimeout(() => {
				commentDispatch({ type: "DELETE_COMMENT", payload: { commentData } });
			}, 500);
		});

		socketService?.socket?.on("addComment", (commentData) => {
			if (postId !== commentData.postId) return;

			commentDispatch({ type: "ADD_COMMENT", payload: { commentData } });
		});
	}
}
