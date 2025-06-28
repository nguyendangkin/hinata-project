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
                    <ScammerUi data={undefined} />
                </main>
            );
        }

        return (
            <main>
                <ScammerUi data={res.data} />
            </main>
        );
    } catch (error) {
        console.error("Lỗi khi gọi API");

        return (
            <main>
                <ScammerUi data={undefined} />
            </main>
        );
    }
};

export default ScammerPage;
