import { auth } from "@/auth";
import AdminUi from "@/components/page/admin/AdminUi";
// import { sendRequest } from "@/utils/api";

interface IProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Fake data generator
const generateFakeData = (count: number): any[] => {
    const data: any[] = [];
    const lastNames = [
        "Nguyễn",
        "Trần",
        "Lê",
        "Phạm",
        "Hoàng",
        "Huỳnh",
        "Phan",
        "Vũ",
        "Võ",
        "Đặng",
    ];
    const middleNames = [
        "Văn",
        "Thị",
        "Hữu",
        "Đình",
        "Ngọc",
        "Kim",
        "Minh",
        "Thanh",
    ];
    const firstNames = [
        "An",
        "Bình",
        "Cường",
        "Dũng",
        "Giang",
        "Hải",
        "Khoa",
        "Long",
        "Mạnh",
        "Nghĩa",
    ];

    for (let i = 0; i < count; i++) {
        const lastName = lastNames[i % lastNames.length];
        const middleName = middleNames[i % middleNames.length];
        const firstName = firstNames[i % firstNames.length];
        const fullName = `${lastName} ${middleName} ${firstName}`;

        const proofImages = Array.from(
            { length: Math.floor(Math.random() * 8) + 3 }, // 3-10 images
            (_, idx) => `https://picsum.photos/600/800?random=${i}${idx}`
        );

        data.push({
            key: i.toString(),
            id: `#${10000 + i}`,
            email: `user${i}@example.com`,
            displayName: `User${i}`,
            bankAccountName: fullName,
            phoneNumber: `0987${Math.floor(100000 + Math.random() * 900000)}`,
            bankAccount: `123456789${i.toString().padStart(3, "0")}`,
            bankName: [
                "Vietcombank",
                "Techcombank",
                "MB Bank",
                "VP Bank",
                "BIDV",
                "ACB",
                "Sacombank",
            ][i % 7],
            facebookLink: `https://facebook.com/user${i}`,
            reportLink: `https://facebook.com/posts/report${i}`,
            proofImages,
            comment: `Bình luận về vấn đề số ${
                i + 1
            } - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
            status: ["pending", "approved", "rejected"][
                Math.floor(Math.random() * 3)
            ] as "pending" | "approved" | "rejected",
        });
    }
    return data;
};

const AdminPage = async (props: IProps) => {
    // Await searchParams để tránh lỗi sync dynamic APIs
    const searchParams = await props.searchParams;

    const current = parseInt(searchParams?.current as string) || 1;
    const pageSize = parseInt(searchParams?.pageSize as string) || 10;
    // const session = await auth();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Generate fake data with pagination
    const totalData = 200; // Total fake records
    const allFakeData = generateFakeData(totalData);
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allFakeData.slice(startIndex, endIndex);

    // Fake response structure
    const fakeResponse = {
        data: {
            results: paginatedData,
            meta: {
                current: current,
                pageSize: pageSize,
                pages: Math.ceil(totalData / pageSize),
                total: totalData,
            },
        },
    };

    /* 
    // Khi có API thật, uncomment đoạn này và comment phần fake data phía trên
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/reports`,
        method: "GET",
        queryParams: {
            current,
            pageSize,
        },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-admin-reports"] },
        },
    });
    */

    return (
        <div>
            <AdminUi
                data={fakeResponse?.data?.results ?? []}
                meta={fakeResponse?.data?.meta}
            />
        </div>
    );
};

export default AdminPage;
