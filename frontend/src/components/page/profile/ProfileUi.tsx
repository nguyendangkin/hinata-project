// components/page/profile/ProfileUi.tsx
"use client";

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
import { requestApiLogoutUser } from "@/util/actions";
import { useExpiredSession } from "@/util/serverRequestHandler";
import { handleApiCall } from "@/util/clientRequestHandler";
import { usePRouter } from "@/hooks/usePRouter";

const { Title, Text } = Typography;

interface DataType {
    key: string;
    id: string;
    bankAccountName: string;
    phoneNumber: string;
    bankAccount: string;
    bankName: string;
    facebookLink: string;
    reportLink: string;
    proofImages: string[];
    comment: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

interface IProps {
    data: DataType[];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    expiredToken?: boolean;
}

const getFullImageUrl = (path: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

const ProfileUi = (props: IProps) => {
    const { data, meta, expiredToken } = props;
    useExpiredSession(!!expiredToken);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = usePRouter();

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
                            loading="lazy"
                            placeholder={
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        background: "#f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text type="secondary">Loading...</Text>
                                </div>
                            }
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

    const columns: ColumnsType<DataType> = [
        {
            title: "ID bài",
            dataIndex: "id",
            key: "id",
            width: 50,
            fixed: "left",
            render: (id) => (
                <span style={{ fontFamily: "monospace" }}>{id}</span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = "default";
                let text = status;

                switch (status) {
                    case "approved":
                        color = "green";
                        text = "Đã duyệt";
                        break;
                    case "rejected":
                        color = "red";
                        text = "Đã từ chối";
                        break;
                    case "pending":
                        color = "orange";
                        text = "Đang chờ";
                        break;
                    default:
                        color = "default";
                }

                return (
                    <Tag color={color} style={{ textTransform: "capitalize" }}>
                        {text}
                    </Tag>
                );
            },
            width: 100,
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
                    {text || "Không có bình luận"}
                </div>
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
            title: "Link facebook cá nhân",
            dataIndex: "facebookLink",
            key: "facebookLink",
            width: 200,
            render: (link) => (
                <Typography.Link href={link} target="_blank">
                    {link}
                </Typography.Link>
            ),
        },
        {
            title: "Link bài tố cáo",
            dataIndex: "reportLink",
            key: "reportLink",
            width: 200,
            render: (link) => (
                <Typography.Link href={link} target="_blank">
                    {link}
                </Typography.Link>
            ),
        },
        {
            title: "Minh chứng",
            dataIndex: "proofImages",
            key: "proofImages",
            render: renderProofImages,
            width: 260,
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
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (date) => new Date(date).toLocaleString(),
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
                <Title level={4}>Danh sách bài viết của bạn</Title>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                scroll={{ x: 1800 }}
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
                pagination={false} // Tắt pagination mặc định của Table
            />

            {data.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 24,
                    }}
                >
                    <Pagination
                        current={meta.current}
                        total={meta.total}
                        pageSize={meta.pageSize}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        onChange={(page, pageSize) => {
                            const params = new URLSearchParams(searchParams);
                            params.set("current", page.toString());
                            params.set("pageSize", pageSize.toString());
                            router.push(`${pathname}?${params.toString()}`);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfileUi;
