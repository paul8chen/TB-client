import { createBrowserRouter } from "react-router-dom";

import { Auth, ForgotPassword, ResetPassword } from "@pages/auth";
import { action as authAction } from "@pages/auth/auth-tabs/Auth";
import { action as forgotPasswordAction } from "@pages/auth/forgot-password/ForgotPassword";
import { action as resetPasswordAction } from "@pages/auth/reset-password/ResetPassword";
import AppNav from "@components/app-nav/AppNav";
import AuthenticatedRoute, {
	loader as authenticatedLoader,
} from "@pages/app/AuthenticatedRoute";
import Post, { loader as postLoader } from "@pages/app/post/Post";
import Chart, { loader as chartLoader } from "@pages/app/chart/Chart";
import Profile from "@pages/app/profile/Profile";

export const AppRouter = createBrowserRouter([
	{
		path: "/",
		element: <Auth />,
		action: authAction,
	},
	{
		path: "/forgot-password",
		element: <ForgotPassword />,
		action: forgotPasswordAction,
	},
	{
		path: "/reset-password",
		element: <ResetPassword />,
		action: resetPasswordAction,
	},
	{
		path: "/app",
		element: (
			<AuthenticatedRoute>
				<AppNav />
			</AuthenticatedRoute>
		),
		loader: authenticatedLoader,
		children: [
			{ path: "chart", element: <Chart />, loader: chartLoader },
			{ path: "post", element: <Post />, loader: postLoader },
			{ path: "profile", element: <Profile /> },
		],
	},
]);
