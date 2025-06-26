"use client"; // Chỉ định đây là Client Component trong Next.js

import {
    Table,
    Button,
    Space,
    Tag,
    Image,
    Pagination,
    Typography,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import {
    reqApprovePost,
    reqBanUser,
    reqRejectPost,
    requestApiLogoutUser,
} from "@/util/actions";
import { useExpiredSession } from "@/util/serverRequestHandler";
import { handleApiCall } from "@/util/clientRequestHandler";

const { Title } = Typography;

// Interface mô tả cấu trúc dữ liệu cho mỗi bản ghi
interface DataType {
    key: string; // Khóa duy nhất
    id: string; // ID bài viết
    email: string; // Email người dùng
    displayName: string; // Tên hiển thị
    bankAccountName: string; // Tên chủ tài khoản
    phoneNumber: string; // Số điện thoại
    bankAccount: string; // Số tài khoản
    bankName: string; // Tên ngân hàng
    facebookLink: string; // Link Facebook
    reportLink: string; // Link bài viết báo cáo
    proofImages: string[]; // Danh sách ảnh minh chứng
    comment: string; // Bình luận
    status: "pending" | "approved" | "rejected"; // Trạng thái
}

// Interface cho props đầu vào
interface IProps {
    data: DataType[]; // Dữ liệu hiển thị
    meta: {
        current: number; // Trang hiện tại
        pageSize: number; // Số bản ghi mỗi trang
        pages: number; // Tổng số trang
        total: number; // Tổng số bản ghi
    };
    expiredToken?: boolean; // Biến xác định xem token có hết hạn hay không
}

// Hàm lấy URL đầy đủ cho ảnh
const getFullImageUrl = (path: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

const AdminUi = (props: IProps) => {
    const { data, meta, expiredToken } = props;

    // Kiểm tra xem token đã hết hạn hay không
    // Nếu có, hiển thị thông báo và chuyển hướng về trang đăng nhập
    useExpiredSession(!!expiredToken);

    const [loading, setLoading] = useState(false); // State loading

    // Các hook của Next.js để quản lý routing
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Hàm xử lý khi nhấn nút duyệt
    const handleApprove = async (id: string) => {
        setLoading(true);
        try {
            const result = await handleApiCall(reqApprovePost(id));

            if (result.statusCode === 201) {
                message.success(result.data?.message);
            } else if (result.statusCode === 400) {
                message.error(result.message);
            }
            // Gọi API để duyệt ở đây
            // await callApiApprove(id);
            // Cập nhật UI ngay lập tức (optimistic update)
        } catch (error) {
            message.error("Lỗi khi duyệt");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý khi nhấn nút từ chối
    const handleReject = async (id: string) => {
        setLoading(true);
        try {
            const result = await handleApiCall(reqRejectPost(id));

            if (result.statusCode === 201) {
                message.success(result.data?.message);
            } else if (result.statusCode === 400) {
                message.error(result.message);
            }
            // Cập nhật UI ngay lập tức (optimistic update)
        } catch (error) {
            message.error("Lỗi khi từ chối");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý khi nhấn nút cấm người dùng
    const handleBanUser = (email: string) => {
        Modal.confirm({
            title: "Xác nhận cấm người dùng này?",
            content:
                "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?",
            okText: "Cấm",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
                setLoading(true);
                try {
                    const result = await handleApiCall(reqBanUser(email));

                    if (result.statusCode === 201) {
                        message.success(result.data?.message);
                    } else if (result.statusCode === 400) {
                        message.error(result.message);
                    }
                } catch (error) {
                    message.error("Lỗi khi cấm user");
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    // Hàm xử lý khi thay đổi phân trang, sắp xếp,...
    const onChange = (
        pagination: any,
        filters: any,
        sorter: any,
        extra: any
    ) => {
        if (pagination && pagination.current) {
            const params = new URLSearchParams(searchParams);
            params.set("current", pagination.current.toString());
            params.set("pageSize", pagination.pageSize.toString());
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    // Hàm render ảnh minh chứng
    const renderProofImages = (images: string[]) => {
        const fullImages = images.map(getFullImageUrl);

        return (
            <Image.PreviewGroup items={fullImages}>
                <Space size={4}>
                    {images.slice(0, 2).map((img, index) => (
                        <Image
                            key={index}
                            src={getFullImageUrl(img)}
                            width={80}
                            height={80}
                            alt={`Proof ${index + 1}`}
                            style={{
                                display: "block",
                                border: "1px solid #d1d5db",
                                objectFit: "cover",
                            }}
                        />
                    ))}
                    {images.length > 2 && (
                        <div
                            style={{
                                position: "relative",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "80px",
                                height: "80px",
                                border: "1px solid #d1d5db",
                                backgroundColor: "#f3f4f6",
                            }}
                        >
                            <Typography.Text strong>
                                +{images.length - 2}
                            </Typography.Text>
                        </div>
                    )}
                </Space>
            </Image.PreviewGroup>
        );
    };

    // Định nghĩa các cột cho bảng
    const columns: ColumnsType<DataType> = [
        // {
        //     title: "STT",
        //     render: (_: any, record: any, index: any) => {
        //         return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
        //     },
        //     width: 50,
        //     fixed: "left",
        // },
        {
            title: "ID bài",
            dataIndex: "id",
            key: "id",
            width: 60,
            fixed: "left",
            render: (id) => (
                <span style={{ fontFamily: "monospace" }}>{id}</span>
            ),
        },
        {
            title: "Số tài khoản",
            dataIndex: "bankAccount",
            key: "bankAccount",
            width: 150,
        },
        {
            title: "Tên chủ tài khoản",
            dataIndex: "bankAccountName",
            key: "bankAccountName",
            width: 180,
        },
        {
            title: "Ngân hàng",
            dataIndex: "bankName",
            key: "bankName",
            width: 150,
        },
        {
            title: "Minh chứng",
            dataIndex: "proofImages",
            key: "proofImages",
            render: renderProofImages,
            width: 300,
        },
        {
            title: "Bình luận",
            dataIndex: "comment",
            key: "comment",
            width: 200,
            render: (text) => (
                <div
                    style={{
                        maxHeight: "80px",
                        overflowY: "auto",
                        paddingRight: "4px",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 180,
            render: (email) => (
                <Typography.Link href={`mailto:${email}`}>
                    {email}
                </Typography.Link>
            ),
        },
        {
            title: "Tên hiển thị",
            dataIndex: "displayName",
            key: "displayName",
            width: 120,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: 130,
            render: (phone) => (
                <Typography.Link href={`tel:${phone}`}>{phone}</Typography.Link>
            ),
        },
        {
            title: "Link Facebook",
            dataIndex: "facebookLink",
            key: "facebookLink",
            width: 150,
            render: (link) => (
                <Typography.Link href={link} target="_blank">
                    Xem profile
                </Typography.Link>
            ),
        },
        {
            title: "Link báo cáo",
            dataIndex: "reportLink",
            key: "reportLink",
            width: 150,
            render: (link) => (
                <Typography.Link href={link} target="_blank">
                    Xem bài viết
                </Typography.Link>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = "default";
                if (status === "approved") color = "green";
                if (status === "rejected") color = "red";
                return (
                    <Tag color={color} style={{ textTransform: "capitalize" }}>
                        {status}
                    </Tag>
                );
            },
            width: 100,
        },
        {
            title: "Hành động",
            key: "action",
            fixed: "right",
            width: 220,
            render: (_, record) => (
                <Space size="small">
                    {record.status === "pending" && (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                loading={loading}
                                onClick={() => handleApprove(record.id)}
                            >
                                Duyệt
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: "#faad14",
                                    color: "white",
                                    borderColor: "#faad14",
                                }}
                                size="small"
                                loading={loading}
                                onClick={() => handleReject(record.id)}
                            >
                                Từ chối
                            </Button>
                            <Button
                                danger
                                size="small"
                                loading={loading}
                                onClick={() => handleBanUser(record.email)}
                            >
                                Cấm
                            </Button>
                        </>
                    )}
                    {record.status !== "pending" && (
                        <Typography.Text type="secondary">
                            Đã xử lý
                        </Typography.Text>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: "16px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                }}
            >
                <span>Quản lý báo cáo</span>
            </div>

            {/* Bảng dữ liệu chính */}
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                scroll={{ x: 2000 }} // Cho phép scroll ngang nếu bảng rộng
                bordered
                size="middle"
                rowKey="id"
                // Custom row height
                components={{
                    body: {
                        row: ({ children, ...props }) => (
                            <tr {...props} style={{ height: "96px" }}>
                                {children}
                            </tr>
                        ),
                    },
                }}
                // Cấu hình phân trang
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showSizeChanger: false, // Ẩn chọn số bản ghi/trang
                    showQuickJumper: false, // Ẩn nhảy nhanh đến trang
                    showLessItems: false, // Hiển thị đầy đủ các nút trang
                    showTotal: (total, range) => (
                        <div>
                            {range[0]}-{range[1]} trên {total} bản ghi
                        </div>
                    ),
                }}
                onChange={onChange}
            />
        </div>
    );
};

export default AdminUi;
