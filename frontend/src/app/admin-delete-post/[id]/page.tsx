import AdminDeletePostUi from "@/components/page/admin-delete-post/AdminDeletePostUi";
import { reqGetAPost } from "@/util/actions";
import type { Metadata, ResolvingMetadata } from "next";

interface IProps {
    params: Promise<{ id: string }>;
}

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const res = await reqGetAPost(id);

    const data = res?.data;

    if (!data) {
        return {
            title: "Không tìm thấy bài tố cáo | camCheckScam",
            description:
                "Bài tố cáo không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại ID.",
        };
    }

    const title = `Xóa bài: ${data?.bankAccountName} - STK ${data?.bankAccount}`;
    const description = `Quản trị viên đang xem và thực hiện thao tác xóa bài tố cáo liên quan đến STK ${data?.bankAccount} (${data?.bankAccountName} - ${data?.bankName}).`;

    return {
        title,
        description,
    };
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
