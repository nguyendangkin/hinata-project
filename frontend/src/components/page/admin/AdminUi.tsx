"use client";

import { Table, Button, Space, Tag, Image, Pagination, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DataType {
    key: string;
    id: string;
    email: string;
    displayName: string;
    bankAccountName: string;
    phoneNumber: string;
    bankAccount: string;
    bankName: string;
    facebookLink: string;
    reportLink: string;
    proofImages: string[];
    comment: string;
    status: "pending" | "approved" | "rejected";
}

const generateFakeData = (count: number): DataType[] => {
    const data: DataType[] = [];
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
            { length: 10 },
            (_, idx) => `https://picsum.photos/600/800?random=${i}${idx}`
        );

        data.push({
            key: i.toString(),
            id: `#${10000 + i}`,
            email: `user${i}@example.com`,
            displayName: `User${i}`,
            bankAccountName: fullName,
            phoneNumber: `0987${Math.floor(100000 + Math.random() * 900000)}`,
            bankAccount: `123456789${i}`,
            bankName: [
                "Vietcombank",
                "Techcombank",
                "MB Bank",
                "VP Bank",
                "BIDV",
            ][i % 5],
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

const AdminUi = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(200);
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 300));
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const fakeData = generateFakeData(total).slice(
                    startIndex,
                    endIndex
                );
                setData(fakeData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, pageSize, total]);

    const handleApprove = (id: string) => {
        setData(
            data.map((item) =>
                item.id === id ? { ...item, status: "approved" } : item
            )
        );
    };

    const handleReject = (id: string) => {
        setData(
            data.map((item) =>
                item.id === id ? { ...item, status: "rejected" } : item
            )
        );
    };

    const handlePageChange = (newPage: number, newPageSize: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        params.set("pageSize", newPageSize.toString());
        router.push(`?${params.toString()}`);
    };

    const renderProofImages = (images: string[]) => (
        <Image.PreviewGroup items={images}>
            <Space size={4}>
                {images.slice(0, 2).map((img, index) => (
                    <Image
                        key={index}
                        src={img}
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

    const columns: ColumnsType<DataType> = [
        {
            title: "ID bài",
            dataIndex: "id",
            key: "id",
            width: 100,
            fixed: "left",
            render: (id) => (
                <span style={{ fontFamily: "monospace" }}>{id}</span>
            ),
            sorter: (a, b) => parseInt(a.id.slice(1)) - parseInt(b.id.slice(1)),
        },
        {
            title: "Số tài khoản",
            dataIndex: "bankAccount",
            key: "bankAccount",
            width: 150,
            sorter: (a, b) => a.bankAccount.localeCompare(b.bankAccount),
        },
        {
            title: "Tên chủ tài khoản",
            dataIndex: "bankAccountName",
            key: "bankAccountName",
            width: 180,
            sorter: (a, b) =>
                a.bankAccountName.localeCompare(b.bankAccountName),
        },
        {
            title: "Ngân hàng",
            dataIndex: "bankName",
            key: "bankName",
            width: 150,
            sorter: (a, b) => a.bankName.localeCompare(b.bankName),
        },
        {
            title: "Minh chứng",
            dataIndex: "proofImages",
            key: "proofImages",
            render: renderProofImages,
            width: 230,
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
            width: 180,
            render: (_, record) => (
                <Space size="small">
                    {record.status === "pending" && (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => handleApprove(record.id)}
                            >
                                Duyệt
                            </Button>
                            <Button
                                danger
                                size="small"
                                onClick={() => handleReject(record.id)}
                            >
                                Từ chối
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
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                scroll={{ x: 1500 }}
                pagination={false}
                bordered
                size="middle"
                components={{
                    body: {
                        row: ({ children, ...props }) => (
                            <tr {...props} style={{ height: "96px" }}>
                                {children}
                            </tr>
                        ),
                    },
                }}
            />
            <div
                style={{
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper={false}
                    showLessItems={false}
                    pageSizeOptions={[10, 20, 50, 100]}
                    itemRender={(current, type, originalElement) => {
                        if (type === "page") {
                            return (
                                <span style={{ padding: "0 8px" }}>
                                    {current}
                                </span>
                            );
                        }
                        return originalElement;
                    }}
                    showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`
                    }
                />
            </div>
        </div>
    );
};

export default AdminUi;
