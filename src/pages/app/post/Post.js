import { Suspense } from "react";
import { Await, defer, json, useLoaderData } from "react-router-dom";

import "@pages/app/post/Post.scss";
import PostBoard from "@components/posts/post-board/PostBoard";
import SortTable from "@components/sort-table/SortTable";
import { postService } from "@services/api/post.service";
import Spinner from "@components/spinner/Spinner";

const Post = () => {
	const { resData } = useLoaderData();

	return (
		<Suspense fallback={<Spinner />}>
			<Await resolve={resData}>
				{(resData) => (
					<div className="post-container">
						<div className="post-layout">
							<div className="post-body">
								<PostBoard
									postData={resData.data.posts}
									postsCount={resData.data.postsCount}
								/>
							</div>
							<div className="post-sort">
								<SortTable />
							</div>
						</div>
					</div>
				)}
			</Await>
		</Suspense>
	);
};

export default Post;

async function loadPost() {
	try {
		const response = await postService.getPost(1);
		if (!response.ok)
			throw json({ status: "error", message: "Server unavailable" });

		return await response.json();
	} catch (err) {
		console.log("fetch posts error");
		return err;
	}
}

export function loader() {
	return defer({
		resData: loadPost(),
	});
}
