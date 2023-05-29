import { createBrowserRouter } from "react-router-dom";

import { Auth, ForgotPassword, ResetPassword } from "@pages/auth";
import { action as authAction } from "@pages/auth/auth-tabs/Auth";
import { action as forgotPasswordAction } from "@pages/auth/forgot-password/ForgotPassword";
import { action as resetPasswordAction } from "@pages/auth/reset-password/ResetPassword";
import Streams from "@pages/social/Streams";

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
		path: "/app/social/streams",
		element: <Streams />,
	},
]);
