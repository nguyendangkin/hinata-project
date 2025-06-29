"use client";

import {
    Card,
    Image,
    Space,
    Typography,
    Tag,
    Divider,
    Button,
    message,
    Modal,
} from "antd";
import {
    CopyOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useExpiredSession } from "@/util/serverRequestHandler";
import { reqDeletePostByAdmin } from "@/util/actions";
import { handleApiCall } from "@/util/clientRequestHandler";
import { useState } from "react";
import { usePRouter } from "@/hooks/usePRouter";

const { Text, Link } = Typography;
const { confirm } = Modal;

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
    expiredToken?: boolean;
}

const getFullImageUrl = (path: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

const AdminDeletePostUi = ({ data, expiredToken }: IProps) => {
    const router = usePRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Kiểm tra xem token đã hết hạn hay không
    // Nếu có, hiển thị thông báo và chuyển hướng về trang đăng nhập
    useExpiredSession(!!expiredToken);

    if (!data) {
        return (
            <div style={{ padding: 32, textAlign: "center" }}>
                <Text type="secondary">Không có dữ liệu để hiển thị.</Text>
            </div>
        );
    }

    const handleDelete = async () => {
        confirm({
            title: "Xác nhận xóa bài viết?",
            icon: <ExclamationCircleOutlined />,
            content: "Thao tác này không thể hoàn tác.",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            async onOk() {
                setIsLoading(true);
                try {
                    const result = await handleApiCall(
                        reqDeletePostByAdmin(data.id)
                    );

                    if (result.statusCode === 201) {
                        message.success(result.data?.message);
                        router.push("/");
                    } else {
                        message.error(result.message);
                    }
                } catch (error) {
                    message.error("Lỗi khi xoá bài viết.");
                } finally {
                    setIsLoading(false);
                }
            },
        });
    };
    return (
        <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
            <Card>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
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

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 16,
                    }}
                >
                    <Button
                        icon={<CopyOutlined />}
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            message.success("Đã sao chép liên kết.");
                        }}
                    >
                        Sao chép liên kết
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Xoá bài viết
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
                        <Text strong>Số điện thoại: </Text>
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
                                Xem Facebook
                            </Link>
                        ) : (
                            <Text type="secondary">Không có thông tin</Text>
                        )}
                    </div>
                    <div>
                        <Text strong>Link báo cáo: </Text>
                        {data.reportLink ? (
                            <Link href={data.reportLink} target="_blank">
                                Xem bài viết
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
                                        style={{
                                            objectFit: "cover",
                                            borderRadius: 4,
                                            border: "1px solid #ddd",
                                        }}
                                        alt={`Minh chứng ${index + 1}`}
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

export default AdminDeletePostUi;
