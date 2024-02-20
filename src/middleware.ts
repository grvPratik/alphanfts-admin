export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/register",
		"/projects",
		"/collections",
		"/collections/:path*",
		"/projects/:path*",
	],
};
