"use server";

import { signIn, signOut } from "@/auth";
import request, { ApiResponse } from "@/util/request";
import { revalidateTag } from "next/cache";

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

export const reqGetVerifyCodeChangePassword = async (
    data: IReqGetVerifyCodeChangePassword
) => {
    try {
        const result = await request.post<IResGetVerifyCodeChangePassword>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/send-verify-code-change-password`,
            data
        );
        return result;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const reqVerifyCodeChangePassword = async (
    data: IReqVerifyCodeChangePassword
) => {
    try {
        const result = await request.post<IResVerifyCodeChangePassword>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-code-change-password`,
            data
        );
        return result;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const reqChangePassword = async (data: IReqChangePassword) => {
    try {
        const result = await request.post<IResChangePassword>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/change-password`,
            data
        );
        return result;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const reqGetProfileUser = async (data: IReqGetProfileUser) => {
    try {
        const result = await request.get<IResGetProfileUser>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`
        );
        return result;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const reqCreatePost = async (data: any) => {
    try {
        const result = await request.post<IResCreatePost>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post/create`,
            data,
            {
                isFile: true,
            }
        );
        return result;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const reqGetAllPost = async (
    current: number = 1,
    pageSize: number = 10
): Promise<any> => {
    try {
        const result = await request.get<IResGetAllPost>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post/get-all-post`,
            {
                queryParams: {
                    current: current,
                    pageSize: pageSize,
                },
                next: {
                    tags: ["list-posts"],
                },
            }
        );
        return result;
    } catch (error) {
        throw error;
    }
};

export const reqApprovePost = async (id: string) => {
    try {
        const result = await request.post<IResApprovePost>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post/approve-post`,
            { id }
        );
        revalidateTag("list-posts");
        return result;
    } catch (error) {
        throw error;
    }
};

export const reqRejectPost = async (id: string) => {
    try {
        const result = await request.post<IResRejectPost>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post/rejected-post`,
            { id }
        );
        revalidateTag("list-posts");
        return result;
    } catch (error) {
        throw error;
    }
};

export const reqBanUser = async (email: string) => {
    try {
        const result = await request.post<IResBanUser>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post/ban-user`,
            { email }
        );
        revalidateTag("list-posts");
        return result;
    } catch (error) {
        throw error;
    }
};

export const reqGetAllPostForClient = async (
    current: number = 1,
    pageSize: number = 10,
    search: string = ""
): Promise<any> => {
    try {
        const result = await request.get<IResGetAllPost>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post/get-all-post-for-client`,
            {
                queryParams: {
                    current: current,
                    pageSize: pageSize,
                    search: search,
                },
            }
        );

        return result;
    } catch (error) {
        throw error;
    }
};

export const reqGetAPost = async (id: string): Promise<any> => {
    try {
        const result = await request.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post/get-a-post`,
            {
                queryParams: { id: id },
            }
        );
        return result;
    } catch (error) {
        throw error;
    }
};

export const reqGetMyPost = async (
    current: number = 1,
    pageSize: number = 10
): Promise<any> => {
    try {
        const result = await request.get<IResGetAllPost>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post/get-my-posts`,
            {
                queryParams: {
                    current: current,
                    pageSize: pageSize,
                },
            }
        );

        return result;
    } catch (error) {
        throw error;
    }
};

export const reqGetAdminAnalytics = async (): Promise<any> => {
    try {
        const result = await request.get<IResGetAdminAnalytics>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/admin-analytics`
        );
        return result;
    } catch (error) {
        throw error;
    }
};

export const reqDeletePostByAdmin = async (id: string) => {
    try {
        const result = await request.post<IResDeletePost>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post/delete-post`,
            { id }
        );
        return result;
    } catch (error) {
        throw error;
    }
};
