import { socketService } from "@services/socket/socket.service";

export class ReactionSocket {
	static listen(postId, reactionDispatch, setCommentsCount) {
		socketService?.socket?.on("updateReaction", (reaction) => {
			if (postId !== reaction.postId) return;

			const { status, type, prevType } = reaction;

			reactionDispatch({ type: status, payload: { type, prevType } });
		});

		socketService?.socket?.on("addComment", (commentData) => {
			if (postId !== commentData.postId) return;

			setCommentsCount((state) => state + 1);
		});

		socketService?.socket?.on("deleteComment", (commentData) => {
			if (postId !== commentData.postId) return;

			setCommentsCount((state) => state - 1);
		});
	}
}
