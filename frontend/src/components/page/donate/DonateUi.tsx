"use client";

import { Card, Typography, Space, Button, message, Divider, Image } from "antd";
import { CopyOutlined, HeartFilled } from "@ant-design/icons";
import React from "react";

const { Title, Text, Paragraph } = Typography;

const accountInfo = [
    {
        label: "Ngân hàng",
        value: "ACB",
    },
    {
        label: "Số tài khoản",
        value: "19997271",
    },
    {
        label: "Chủ tài khoản",
        value: "NGUYEN DANG KIN",
    },
];

export default function DonateUi() {
    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            message.success("Đã sao chép!");
        } catch {
            message.error("Không thể sao chép");
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
            <Card variant="outlined">
                <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                >
                    <Title level={3}>
                        <HeartFilled style={{ color: "red", marginRight: 8 }} />
                        Ủng hộ camCheckScam
                    </Title>
                    <Paragraph>
                        Dự án <Text strong>camCheckScam</Text> được xây dựng
                        nhằm hỗ trợ cộng đồng cảnh báo và ngăn chặn các hành vi
                        lừa đảo qua tài khoản ngân hàng v.v. Việc duy trì hệ
                        thống yêu cầu chi phí cho máy chủ, tên miền và vận hành.
                    </Paragraph>
                    <Paragraph>
                        Nếu bạn thấy dự án hữu ích, thì có thể tùy tâm ủng hộ
                        chúng tôi để duy trì và phát triển thêm nhiều tính năng
                        hơn nữa nhé!
                    </Paragraph>

                    <Divider />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Image
                            width={240}
                            src="/images/qr-donate.jpg"
                            alt="QR Donate"
                            preview={false}
                            style={{ borderRadius: 8 }}
                        />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <Text type="secondary">
                            (Quét QR bằng app ngân hàng)
                        </Text>
                    </div>

                    <Divider />

                    {accountInfo.map((item) => (
                        <div
                            key={item.label}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px 0",
                                borderBottom: "1px dashed #e8e8e8",
                            }}
                        >
                            <Text strong>{item.label}:</Text>
                            <Space>
                                <Text>{item.value}</Text>
                                <Button
                                    type="text"
                                    icon={<CopyOutlined />}
                                    onClick={() => handleCopy(item.value)}
                                />
                            </Space>
                        </div>
                    ))}

                    <Divider />

                    <Text italic type="secondary">
                        Xin chân thành cảm ơn những tấm lòng đã ủng hộ và đồng
                        hành cùng dự án!
                    </Text>
                </Space>
            </Card>
        </div>
    );
}
