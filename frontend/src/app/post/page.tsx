import PostUi from "@/components/page/post/PostUi";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tạo bài tố cáo - camCheckScam",
    description:
        "Điền thông tin để tố cáo hành vi lừa đảo qua tài khoản ngân hàng, ví điện tử hoặc Facebook. Bài đăng sẽ giúp cộng đồng cảnh giác và tránh bị lừa.",
};

export default function PostPage() {
    return <PostUi />;
}
