import AdminUi from "@/components/page/admin/AdminUi";
import { reqGetAllPost } from "@/util/actions";

interface IProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AdminPage = async (props: IProps) => {
    const searchParams = await props.searchParams;

    const current = parseInt(searchParams?.current as string) || 1;
    const pageSize = parseInt(searchParams?.pageSize as string) || 10;

    try {
        const res = await reqGetAllPost(current, pageSize);

        return (
            <div>
                <AdminUi
                    data={res?.data?.results ?? []}
                    meta={res.data?.meta}
                />
            </div>
        );
    } catch (error) {
        console.error("Lỗi khi gọi API get-all-post:", error);

        return (
            <div className="text-red-500 p-4">
                Không thể tải dữ liệu. Vui lòng thử lại sau.
            </div>
        );
    }
};

export default AdminPage;
