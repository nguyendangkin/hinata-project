import AdminUi from "@/components/page/admin/AdminUi";
import { reqGetAllPost } from "@/util/actions";
import { Metadata } from "next";

interface IProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
    title: "Quản lý bài tố cáo - camCheckScam",
    description:
        "Trang quản trị các bài tố cáo hành vi lừa đảo do người dùng đăng tải. Quản trị viên có thể xem, duyệt và xử lý các báo cáo để bảo vệ cộng đồng.",
};

const AdminPage = async (props: IProps) => {
    const searchParams = await props.searchParams;

    const current = parseInt(searchParams?.current as string) || 1;
    const pageSize = parseInt(searchParams?.pageSize as string) || 10;

    try {
        const res = await reqGetAllPost(current, pageSize);
        const expiredToken = res?.statusCode === 403;
        return (
            <div>
                <AdminUi
                    data={res?.data?.results ?? []}
                    meta={
                        res.data?.meta ?? {
                            current: 1,
                            pageSize: 10,
                            pages: 1,
                            total: 0,
                        }
                    }
                    expiredToken={expiredToken}
                />
            </div>
        );
    } catch (error) {
        console.error("Lỗi khi gọi API get all post");

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
};

export default AdminPage;
