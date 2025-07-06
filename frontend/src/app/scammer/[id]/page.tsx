import ScammerUi from "@/components/page/scammer/ScammerUi";
import { extractIdFromSlug } from "@/helper/extractIdFromSlug";
import { reqGetAPost } from "@/util/actions";
import type { Metadata, ResolvingMetadata } from "next";
import slugify from "slugify";

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
    const postId = extractIdFromSlug(id);
    const res = await reqGetAPost(postId);

    const data = res?.data;

    if (!data) {
        return {
            title: "Bài tố cáo không tồn tại - camCheckScam",
            description:
                "Không tìm thấy thông tin bài tố cáo. Vui lòng kiểm tra lại đường dẫn.",
            openGraph: {
                title: "Bài tố cáo không tồn tại - camCheckScam",
                description:
                    "Không tìm thấy thông tin bài tố cáo. Vui lòng kiểm tra lại đường dẫn.",
                type: "website",
                // images: ["/images/qr-donate.jpg"], // cần 1 biến env domain thật và sau này là ảnh thật của wed
                images: [
                    "https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png",
                ],
            },
        };
    }

    const title = `Lừa đảo ${data?.bankAccountName} - STK ${data?.bankAccount}`;
    const description = `Bài tố cáo hành vi lừa đảo liên quan đến tài khoản ngân hàng ${data?.bankAccount} - ${data?.bankAccountName} - ${data?.bankName}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            // images: ["/images/qr-donate.jpg"], // cần 1 biến env domain thật và sau này là ảnh thật của wed
            images: [
                "https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png",
            ],
        },
    };
}

const ScammerPage = async (props: IProps) => {
    const params = await props.params;
    const postId = extractIdFromSlug(params.id);
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
