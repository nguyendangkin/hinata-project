import LoginUi from "@/components/page/login/LoginUi";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng nhập - camCheckScam",
    description:
        "Đăng nhập vào camCheckScam để quản lý bài tố cáo, theo dõi lịch sử và bảo vệ cộng đồng khỏi các hành vi lừa đảo trực tuyến.",
};

export default function LoginPage() {
    return <LoginUi />;
}
