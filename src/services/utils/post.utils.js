export class PostUtils {
	static getImgFromCloudinary(imgVersion, imgId) {
		return `${process.env.REACT_APP_CLOUDINARY_URL}/v${imgVersion}/${imgId}`;
	}

	static getLastPage(totalPost) {
		const postPerPage = process.env.REACT_APP_POST_PER_PAGE;
		const postPerPageBytotalPost = Math.floor(totalPost / postPerPage);
		const postPerPageBytotalPostRemain = totalPost % postPerPage;

		return postPerPageBytotalPostRemain
			? postPerPageBytotalPost + 1
			: postPerPageBytotalPost;
	}

	static getPostReactionInitState(reactions) {
		return {
			...reactions,
			reactionsCount: Object.values(reactions).reduce(
				(agg, count) => agg + count
			),
		};
	}

	static getPostCommentInitState(commentsCount) {
		return { comments: [], commentsCount };
	}
}
