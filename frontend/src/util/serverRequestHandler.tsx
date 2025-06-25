import { useEffect } from "react";
import { message } from "antd";
import { requestApiLogoutUser } from "@/util/actions";

export const useExpiredSession = (expired: boolean) => {
    useEffect(() => {
        if (expired) {
            const logoutAndRedirect = async () => {
                message.warning(
                    "Phiên đăng nhập đã hết hạn. Đang chuyển hướng..."
                );
                await requestApiLogoutUser();
                setTimeout(() => {
                    window.location.href = "/login";
                }, 3000);
            };

            logoutAndRedirect();
        }
    }, [expired]);
};
