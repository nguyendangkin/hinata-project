import ScammerUi from "@/components/page/scammer/ScammerUi";
import { reqGetAPost } from "@/util/actions";

interface IProps {
    params: Promise<{ id: string }>;
}

const ScammerPage = async (props: IProps) => {
    const params = await props.params;
    const postId = params.id;

    try {
        const res = await reqGetAPost(postId);

        if (!res?.data) {
            return (
                <main>
                    <ScammerUi
                        data={undefined}
                        loading={false}
                        error="Không tìm thấy bài viết này"
                    />
                </main>
            );
        }

        return (
            <main>
                <ScammerUi data={res.data} loading={false} error={null} />
            </main>
        );
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);

        return (
            <main>
                <ScammerUi
                    data={undefined}
                    loading={false}
                    error="Lỗi hệ thống. Vui lòng thử lại sau."
                />
            </main>
        );
    }
};

export default ScammerPage;
