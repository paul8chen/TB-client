import { createBrowserRouter } from "react-router-dom";
import { AuthTabs, ForgotPassword, ResetPassword } from "./pages/auth";

export const AppRouter = createBrowserRouter([
	{
		path: "/",
		element: <AuthTabs />,
	},
	{
		path: "/forgot-password",
		element: <ForgotPassword />,
	},
	{
		path: "/reset-password",
		element: <ResetPassword />,
	},
]);
