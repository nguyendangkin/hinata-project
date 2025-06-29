import AdminDeletePostUi from "@/components/page/admin-delete-post/AdminDeletePostUi";
import { reqGetAPost } from "@/util/actions";

interface IProps {
    params: Promise<{ id: string }>;
}

const AdminDeletePostPage = async ({ params }: IProps) => {
    const { id } = await params;

    try {
        const res = await reqGetAPost(id);
        const expiredToken = res?.statusCode === 403;

        return (
            <main>
                <AdminDeletePostUi
                    data={res?.data}
                    expiredToken={expiredToken}
                />
            </main>
        );
    } catch (error) {
        console.error("Lỗi khi lấy bài post");
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

export default AdminDeletePostPage;
