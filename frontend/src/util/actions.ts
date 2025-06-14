"use server";

import { signIn, signOut } from "@/auth";
import request from "@/util/request";

export const requestApiRegisterUser = async (data: IRequestApiRegisterUser) => {
    try {
        const result = await request.post<IResponseApiRegisterUser>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
            data
        );

        return result;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const requestApiVerifyCodeUser = async (
    data: IRequestApiVerifyCodeUser
) => {
    try {
        const result = await request.post<IResponseVerifyCodeUser>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-code`,
            data
        );

        return result;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const requestApiResendVerifyCodeUser = async (
    data: IRequestApiResendVerifyCodeUser
) => {
    try {
        const result = await request.post<IResponseResendVerifyCodeUser>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/resend-verify-code`,
            data
        );

        return result;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const requestApiSendVerifyCodeUser = async (
    data: IReqSendVerifyCodeUser
) => {
    try {
        const result = await request.post<IResSendVerifyCodeUser>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/send-verify-code`,
            data
        );

        return result;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const requestApiLoginUser = async (data: IReqLogin) => {
    try {
        const result = await request.post<IResLogin>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
            data
        );
        return result;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export async function authenticate(email: string, password: string) {
    try {
        const result = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });
        return result;
    } catch (error) {
        // console.log(error);
        if ((error as any).name === "InvalidEmailPasswordError") {
            return {
                error: (error as any).type,
                code: 1,
            };
        } else if ((error as any).name === "InactiveAccountError") {
            return {
                error: (error as any).type,
                code: 2,
            };
        } else {
            return {
                error: "Có lỗi đã xảy ra",
                code: 0,
            };
        }
    }
}

export const requestApiLogoutUser = async () => {
    try {
        await signOut({ redirect: false });
    } catch (error) {
        // console.log(error);
        throw error;
    }
};
