"use client";

import { Card, Typography, Space, Button, message, Divider } from "antd";
import { CopyOutlined, HeartFilled } from "@ant-design/icons";
import React from "react";
import Image from "next/image";
import qrDonateCode from "../../../../public/images/qr-donate.jpg";

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
                        lừa đảo qua tài khoản ngân hàng v.v. Tuy nhiên việc duy
                        trì hệ thống yêu cầu chi phí cho máy chủ, tên miền và
                        vận hành. Nếu thấy dự án hữu ích, bạn có thể tùy tâm ủng
                        hộ chúng tôi để duy trì và phát triển thêm những tính
                        năng mới nữa nhé!
                    </Paragraph>

                    <Text italic type="secondary">
                        Xin chân thành cảm ơn những tấm lòng đã ủng hộ và đồng
                        hành cùng dự án!
                    </Text>

                    <Divider />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Image
                            alt="QR Donate"
                            src={qrDonateCode}
                            sizes="100vw"
                            style={{
                                width: "100%",
                                height: "auto",
                                maxWidth: 300, // <-- Giới hạn kích thước tối đa
                            }}
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
                </Space>
            </Card>
        </div>
    );
}
