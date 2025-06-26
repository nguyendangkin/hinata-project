import HomeUi from "@/components/page/home/HomeUi";
import { reqGetAllPost, reqGetAllPostForClient } from "@/util/actions";

interface IProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const HomePage = async (props: IProps) => {
    const searchParams = await props.searchParams;

    const current = parseInt(searchParams?.current as string) || 1;
    const pageSize = parseInt(searchParams?.pageSize as string) || 10;
    const search = (searchParams?.search as string) || "";

    try {
        // Gọi API với search term nếu có
        const res = await reqGetAllPostForClient(current, pageSize, search);

        return (
            <main>
                <HomeUi
                    data={res?.data?.results ?? []}
                    meta={
                        res.data?.meta ?? {
                            current: 1,
                            pageSize: 10,
                            pages: 1,
                            total: 0,
                        }
                    }
                    searchTerm={search}
                />
            </main>
        );
    } catch (error) {
        console.error("Lỗi khi gọi API");

        return (
            <main>
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
            </main>
        );
    }
};

export default HomePage;
