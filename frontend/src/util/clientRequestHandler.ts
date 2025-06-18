// util/clientRequestHandler.ts
"use client";

import { message } from "antd";
import { ApiResponse } from "./request";
import { requestApiLogoutUser } from "@/util/actions";

// cho các cuộc gọi api ở action mà có dùng jwt để nhận thông báo thoát khi hết hạn token hoặc hỏng
export async function handleApiCall<T>(
    apiCall: Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> {
    const result = await apiCall;

    if (!result.success && result.statusCode === 403) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        await requestApiLogoutUser();

        // Chờ 3 giây rồi mới redirect
        setTimeout(() => {
            window.location.href = "/login";
        }, 3000);
    }

    return result;
}
