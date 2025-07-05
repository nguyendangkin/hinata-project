import DonateUi from "@/components/page/donate/DonateUi";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ủng hộ camCheckScam - Chung tay chống lừa đảo",
    description:
        "Nếu thấy hữu ích, bạn có thể đóng góp để hỗ trợ camCheckScam duy trì hoạt động, phát triển hệ thống và bảo vệ cộng đồng khỏi các hành vi lừa đảo trực tuyến.",
};

export default function DonatePage() {
    return <DonateUi />;
}
