import RegisterUi from "@/components/page/register/RegisterUi";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng ký tài khoản - camCheckScam",
    description:
        "Tạo tài khoản để đăng bài tố cáo và theo dõi các trường hợp lừa đảo. camCheckScam giúp bạn bảo vệ bản thân và cộng đồng khỏi các hành vi gian lận.",
};

export default function RegisterPage() {
    return <RegisterUi />;
}
