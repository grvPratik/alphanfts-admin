import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import Admin from "@/schema/adminSchema";
import connect from "@/database/connect";
import { AuthOptions } from "next-auth";
import connectDB from "@/database/connect";

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},

			async authorize(credentials) {
				const { username, password }: any = credentials;

				try {
					await connectDB();
					const user = await Admin.findOne({ username });

					if (!user) {
						return null;
					}

					const passwordsMatch = await bcrypt.compare(password, user.password);

					if (!passwordsMatch) {
						return null;
					}

					const returnedUser = {
						id: user._id,
						name: user.username,
						email: user.email,
					};
					return returnedUser;
				} catch (error) {
					console.log("Error: ", error);
					return null;
				}
			},
		}),
	],

	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login",
	},
};
