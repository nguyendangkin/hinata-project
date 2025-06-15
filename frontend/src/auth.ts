import { IUser } from "@/types/next-auth";
import { requestApiLoginUser } from "@/util/actions";
import {
    InactiveAccountError,
    InvalidEmailPasswordError,
} from "@/util/customErrorAuthJs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                // bắt đầu gọi api xuống backend để đăng nhập
                const result = await requestApiLoginUser({
                    email: credentials.email as string,
                    password: credentials.password as string,
                });
                if (result.statusCode === 201) {
                    return {
                        id: result.data?.user.id?.toString(),
                        email: result.data?.user.email,
                        displayName: result.data?.user.displayName,
                        username: result.data?.user.username,
                        access_token: result.data?.access_token,
                    };
                } else if (result.statusCode === 401) {
                    throw new InvalidEmailPasswordError();
                } else if (result.statusCode === 400) {
                    throw new InactiveAccountError();
                } else {
                    throw new Error("Đã có lỗi xảy ra");
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                // User is available during sign-in
                token.user = user as unknown as IUser;
            }
            return token;
        },
        session({ session, token }) {
            (session.user as IUser) = token.user;
            return session;
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated,
            //otherwise redirect to login page
            return !!auth;
        },
    },
});
