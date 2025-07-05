"use client";

import { Card, Image, Space, Typography, Tag, Divider } from "antd";
import { Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const { Text, Link, Title } = Typography;

interface PostData {
    id: string;
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
    data?: PostData;
}

const getFullImageUrl = (path: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

const ScammerUi = ({ data }: IProps) => {
    if (!data) {
        return (
            <div style={{ padding: 32, textAlign: "center" }}>
                <Text type="secondary">Không có dữ liệu để hiển thị.</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
            <Card>
                {/* Hàng đầu: ID, Display Name, Trạng thái */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 8,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 8,
                        }}
                    >
                        <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                            {data.id}
                        </Text>
                        <Divider type="vertical" />
                        <Text>{data.displayName}</Text>
                    </div>
                    <Tag
                        color={
                            data.status === "approved"
                                ? "green"
                                : data.status === "rejected"
                                ? "red"
                                : "orange"
                        }
                    >
                        {data.status.toUpperCase()}
                    </Tag>
                </div>

                {/* Hàng thứ hai: Nút sao chép liên kết */}
                <div style={{ textAlign: "right", marginBottom: 16 }}>
                    <Button
                        icon={<CopyOutlined />}
                        onClick={() => {
                            const url =
                                typeof window !== "undefined"
                                    ? window.location.href
                                    : "";
                            if (url) {
                                navigator.clipboard.writeText(url);
                                message.success(
                                    "Đã sao chép liên kết bài viết!"
                                );
                            }
                        }}
                    >
                        Sao chép liên kết
                    </Button>
                </div>

                <Divider />

                <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                >
                    <div>
                        <Text strong>Họ tên (tài khoản ngân hàng): </Text>
                        <Text>{data.bankAccountName}</Text>
                    </div>
                    <div>
                        <Text strong>Số tài khoản: </Text>
                        <Text>{data.bankAccount}</Text>
                    </div>
                    <div>
                        <Text strong>Ngân hàng: </Text>
                        <Text>{data.bankName}</Text>
                    </div>
                    <div>
                        <Text strong>Số điện thoại (Zalo/MoMo...): </Text>
                        {data.phoneNumber ? (
                            <Link href={`tel:${data.phoneNumber}`}>
                                {data.phoneNumber}
                            </Link>
                        ) : (
                            <Text type="secondary">Không có thông tin</Text>
                        )}
                    </div>
                    <div>
                        <Text strong>Facebook cá nhân: </Text>
                        {data.facebookLink ? (
                            <Link href={data.facebookLink} target="_blank">
                                {data.facebookLink}
                            </Link>
                        ) : (
                            <Text type="secondary">Không có thông tin</Text>
                        )}
                    </div>
                    <div>
                        <Text strong>Link báo cáo: </Text>
                        {data.reportLink ? (
                            <Link href={data.reportLink} target="_blank">
                                {data.reportLink}
                            </Link>
                        ) : (
                            <Text type="secondary">Không có thông tin</Text>
                        )}
                    </div>
                </Space>

                <div style={{ marginTop: 24 }}>
                    <Text strong>Hình ảnh minh chứng:</Text>
                    <div style={{ marginTop: 8 }}>
                        <Image.PreviewGroup>
                            <Space wrap size={8}>
                                {data.proofImages.map((img, index) => (
                                    <Image
                                        key={index}
                                        width={100}
                                        height={100}
                                        src={getFullImageUrl(img)}
                                        loading="lazy"
                                        placeholder={
                                            <div
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    background: "#f0f0f0",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Text type="secondary">
                                                    Đang tải...
                                                </Text>
                                            </div>
                                        }
                                        alt={`Minh chứng ${index + 1}`}
                                        style={{
                                            objectFit: "cover",
                                            borderRadius: 4,
                                            border: "1px solid #ddd",
                                        }}
                                    />
                                ))}
                            </Space>
                        </Image.PreviewGroup>
                    </div>
                </div>

                <div style={{ marginTop: 24 }}>
                    <Text strong>Bình luận:</Text>
                    <div
                        style={{
                            marginTop: 8,
                            padding: "8px 12px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: 4,
                        }}
                    >
                        <Text>{data.comment || "Không có bình luận"}</Text>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ScammerUi;
