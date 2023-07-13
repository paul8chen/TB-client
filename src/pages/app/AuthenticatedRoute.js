import PropTypes from "prop-types";
import { Suspense } from "react";
import { useDispatch } from "react-redux";
import { Await, json, useLoaderData, Navigate, defer } from "react-router-dom";

import useLocalStorage from "@hooks/useLocalStorage";
import { userService } from "@services/api/User.service";
import { Utils } from "@services/utils/utils.service";

const AuthenticatedRoute = ({ children }) => {
	const [deleteStorageUsername] = useLocalStorage("username", "delete");
	const [setUserStorage] = useLocalStorage("username", "set");
	const [setUIdStorage] = useLocalStorage("uId", "set");
	const dispatch = useDispatch();
	const { resData } = useLoaderData();

	return (
		<Suspense fallback={<p>User verification...</p>}>
			<Await resolve={resData}>
				{(resData) => {
					if (resData.status !== "success") {
						Utils.clearUserStorage(deleteStorageUsername, dispatch);
						return <Navigate to="/" />;
					}
					const { token, user } = resData.data;
					Utils.saveUserStorage(
						{ token, user },
						setUserStorage,
						setUIdStorage,
						dispatch
					);

					return children;
				}}
			</Await>
		</Suspense>
	);
};

AuthenticatedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AuthenticatedRoute;

async function loadStatus() {
	try {
		const response = await userService.currentUser();
		if (!response.ok)
			throw json({ status: "error", message: "Servrer unavailable" });

		const resData = await response.json();
		return resData;
	} catch (err) {
		return "error";
	}
}

export function loader() {
	return defer({
		resData: loadStatus(),
	});
}
