"use client";

import { Table, Button, Space, Tag, Image, Pagination, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

interface IProps {
    data: DataType[];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
}

const AdminUi = (props: IProps) => {
    const { data: initialData, meta } = props;
    const [data, setData] = useState<DataType[]>(initialData);
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleApprove = async (id: string) => {
        setLoading(true);
        try {
            // Gọi API để approve
            // await sendRequest({...})

            // Cập nhật local state
            setData(
                data.map((item) =>
                    item.id === id ? { ...item, status: "approved" } : item
                )
            );
        } catch (error) {
            console.error("Error approving:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (id: string) => {
        setLoading(true);
        try {
            // Gọi API để reject
            // await sendRequest({...})

            // Cập nhật local state
            setData(
                data.map((item) =>
                    item.id === id ? { ...item, status: "rejected" } : item
                )
            );
        } catch (error) {
            console.error("Error rejecting:", error);
        } finally {
            setLoading(false);
        }
    };

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
            title: "STT",
            render: (_: any, record: any, index: any) => {
                return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
            },
            width: 60,
            fixed: "left",
        },
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
            sorter: (a, b) => a.email.localeCompare(b.email),
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
            sorter: (a, b) => a.displayName.localeCompare(b.displayName),
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: 130,
            sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
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
            width: 180,
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
                                danger
                                size="small"
                                loading={loading}
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

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                scroll={{ x: 2000 }}
                bordered
                size="middle"
                rowKey="id"
                components={{
                    body: {
                        row: ({ children, ...props }) => (
                            <tr {...props} style={{ height: "96px" }}>
                                {children}
                            </tr>
                        ),
                    },
                }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showSizeChanger: false, // Ẩn page size selector
                    showQuickJumper: false, // Ẩn quick jumper
                    showLessItems: false, // Hiển thị full pagination numbers
                    showTotal: (total, range) => (
                        <div>
                            {range[0]}-{range[1]} trên {total} items
                        </div>
                    ),
                }}
                onChange={onChange}
            />
        </div>
    );
};

export default AdminUi;
