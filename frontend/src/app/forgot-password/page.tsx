import ForgotPasswordUi from "@/components/page/forgot-password/ForgotPasswordUi";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quên mật khẩu - camCheckScam",
    description:
        "Khôi phục mật khẩu tài khoản camCheckScam để tiếp tục tra cứu và quản lý các bài tố cáo lừa đảo.",
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordUi />;
}
