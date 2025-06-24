import { auth } from "@/auth";
import AdminUi from "@/components/page/admin/AdminUi";
// import { sendRequest } from "@/utils/api";

// Interface cho props đầu vào
interface IProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Hàm tạo dữ liệu giả để test giao diện
 * @param count - Số lượng bản ghi cần tạo
 * @returns Mảng các bản ghi giả
 */
const generateFakeData = (count: number): any[] => {
    const data: any[] = [];

    // Danh sách họ, tên đệm và tên phổ biến ở Việt Nam
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

    // Tạo dữ liệu giả
    for (let i = 0; i < count; i++) {
        // Tạo tên ngẫu nhiên
        const lastName = lastNames[i % lastNames.length];
        const middleName = middleNames[i % middleNames.length];
        const firstName = firstNames[i % firstNames.length];
        const fullName = `${lastName} ${middleName} ${firstName}`;

        // Tạo danh sách ảnh minh chứng ngẫu nhiên (3-10 ảnh)
        const proofImages = Array.from(
            { length: Math.floor(Math.random() * 8) + 3 },
            (_, idx) => `https://picsum.photos/600/800?random=${i}${idx}`
        );

        // Thêm bản ghi vào mảng dữ liệu
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

/**
 * Trang quản trị Admin
 */
const AdminPage = async (props: IProps) => {
    // Lấy tham số từ URL (phân trang)
    const searchParams = await props.searchParams;

    // Thiết lập tham số phân trang
    const current = parseInt(searchParams?.current as string) || 1;
    const pageSize = parseInt(searchParams?.pageSize as string) || 10;

    // Lấy thông tin session (đã comment để test)
    // const session = await auth();

    // Giả lập delay call API
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Tạo dữ liệu giả với phân trang
    // Tổng số bản ghi giả
    const totalData = 200;
    // Gọi hàm generateFakeData để tạo ra 200 bản ghi dữ liệu giả
    const allFakeData = generateFakeData(totalData);
    // Tính chỉ số bắt đầu của trang hiện tại (ví dụ: trang 2, pageSize 10 => bắt đầu từ 10)
    const startIndex = (current - 1) * pageSize;
    // Tính chỉ số kết thúc của trang hiện tại (không lấy bản ghi ở vị trí endIndex)
    const endIndex = startIndex + pageSize;
    // Lấy ra các bản ghi thuộc trang hiện tại bằng cách cắt mảng allFakeData
    const paginatedData = allFakeData.slice(startIndex, endIndex);

    // Cấu trúc response giả
    const fakeResponse = {
        data: {
            results: paginatedData,
            meta: {
                current: current, // Trang hiện tại
                pageSize: pageSize, // Số bản ghi trên mỗi trang
                pages: Math.ceil(totalData / pageSize), // Tổng số trang (làm tròn lên)
                total: totalData, // Tổng số bản ghi
            },
        },
    };

    /* 
    // Khi có API thật, bỏ comment đoạn này và comment phần fake data phía trên
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
            {/* Render component AdminUi với dữ liệu giả */}
            <AdminUi
                data={fakeResponse?.data?.results ?? []}
                meta={fakeResponse?.data?.meta}
            />
        </div>
    );
};

export default AdminPage;
