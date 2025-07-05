import AdminViewUi from "@/components/page/admin-view/AdminViewUi";
import { reqGetAdminAnalytics } from "@/util/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bảng điều khiển quản trị - camCheckScam",
    description:
        "Xem thống kê hệ thống, hoạt động người dùng và tổng quan dữ liệu tố cáo. Trang dành riêng cho quản trị viên để quản lý và giám sát nền tảng camCheckScam.",
};

export default async function AdminViewPage() {
    try {
        const result = await reqGetAdminAnalytics();
        const expiredToken = result?.statusCode === 403;

        return (
            <AdminViewUi
                analytics={result?.data ?? null}
                expiredToken={expiredToken}
            />
        );
    } catch (error) {
        return (
            <div
                style={{
                    color: "#ef4444",
                    padding: "16px",
                    textAlign: "center",
                }}
            >
                <h2
                    style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                    }}
                >
                    Không thể tải dữ liệu
                </h2>
                <p>Vui lòng thử lại sau hoặc liên hệ quản trị viên.</p>
            </div>
        );
    }
}
