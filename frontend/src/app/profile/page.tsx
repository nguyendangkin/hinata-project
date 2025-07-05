// app/profile/page.tsx
import ProfileUi from "@/components/page/profile/ProfileUi";
import { reqGetMyPost } from "@/util/actions";
import { Metadata } from "next";

interface IProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
    title: "Hồ sơ cá nhân - camCheckScam",
    description:
        "Xem và quản lý các bài tố cáo bạn đã đăng. Theo dõi lịch sử hoạt động và cập nhật thông tin liên quan đến các vụ lừa đảo bạn đã báo cáo.",
};

const ProfilePage = async (props: IProps) => {
    const searchParams = await props.searchParams;

    const current = parseInt(searchParams?.current as string) || 1;
    const pageSize = parseInt(searchParams?.pageSize as string) || 10;

    try {
        const res = await reqGetMyPost(current, pageSize);
        const expiredToken = res?.statusCode === 403;

        return (
            <div>
                <ProfileUi
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
        console.error("Lỗi khi gọi API get my posts");

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

export default ProfilePage;
