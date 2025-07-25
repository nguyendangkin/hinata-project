"use client";

import { Layout, Row, Col, Typography, Space, Divider } from "antd";
import {
    SafetyOutlined,
    MailOutlined,
    FacebookOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

export default function FooterUi() {
    return (
        <Footer
            style={{
                backgroundColor: "#f9fafb",
                color: "#495057",
                padding: "40px 16px",
                borderTop: "1px solid #eaecef",
                marginTop: "auto",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                <Row gutter={[32, 32]}>
                    {/* Giới thiệu */}
                    <Col xs={24} sm={12} md={8}>
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{ display: "flex" }}
                        >
                            <Title
                                level={4}
                                style={{
                                    color: "#212529",
                                    margin: 0,
                                    fontWeight: 600,
                                }}
                            >
                                camCheckScam
                            </Title>
                            <Text style={{ color: "#6c757d" }}>
                                camCheckScam là nền tảng giúp bạn tra cứu, xác
                                minh và báo cáo các hành vi lừa đảo liên quan
                                đến tài khoản ngân hàng và giao dịch trực tuyến.
                                Cùng nhau bảo vệ cộng đồng khỏi những mối đe dọa
                                ảo.
                            </Text>
                            <Space wrap size="middle">
                                <FacebookOutlined
                                    style={{
                                        fontSize: "20px",
                                        color: "#6c757d",
                                        cursor: "pointer",
                                    }}
                                />
                            </Space>
                        </Space>
                    </Col>

                    {/* Hỗ trợ & Liên hệ */}
                    <Col xs={24} sm={12} md={8}>
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{ display: "flex" }}
                        >
                            <Title
                                level={5}
                                style={{ color: "#212529", fontWeight: 500 }}
                            >
                                Hỗ trợ & Liên hệ
                            </Title>
                            <Space>
                                <MailOutlined style={{ color: "#6c757d" }} />
                                <Typography.Link href="mailto:kinnguyendang@gmail.com">
                                    kinnguyendang@gmail.com
                                </Typography.Link>
                            </Space>
                            <Text style={{ color: "#6c757d" }}>
                                Nếu bạn gặp vấn đề hoặc phát hiện nội dung đáng
                                nghi, vui lòng liên hệ với chúng tôi qua email
                                để được hỗ trợ hoặc báo cáo kịp thời.
                            </Text>
                        </Space>
                    </Col>

                    {/* Dịch vụ */}
                    <Col xs={24} sm={24} md={8}>
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{ display: "flex" }}
                        >
                            <Title
                                level={5}
                                style={{ color: "#212529", fontWeight: 500 }}
                            >
                                <SafetyOutlined
                                    style={{
                                        marginRight: "8px",
                                        color: "#6c757d",
                                    }}
                                />
                                Dịch vụ
                            </Title>
                            <Link style={{ color: "#6c757d" }} href="/">
                                Tra cứu tài khoản
                            </Link>
                            <Link style={{ color: "#6c757d" }} href="/post">
                                Báo cáo lừa đảo
                            </Link>
                        </Space>
                    </Col>
                </Row>

                <Divider
                    style={{ borderColor: "#eaecef", margin: "32px 0 24px 0" }}
                />

                {/* Cảnh báo */}
                <div
                    style={{
                        backgroundColor: "#fff3cd",
                        padding: "16px",
                        borderRadius: "6px",
                        marginBottom: "24px",
                        border: "1px solid #ffeeba",
                    }}
                >
                    <Space
                        direction="horizontal"
                        wrap
                        style={{ display: "flex" }}
                    >
                        <ExclamationCircleOutlined
                            style={{ fontSize: "16px", color: "#856404" }}
                        />
                        <Text strong style={{ color: "#856404" }}>
                            Lưu ý: Không cung cấp thông tin cá nhân hoặc chuyển
                            tiền cho người không rõ danh tính. Luôn xác minh kỹ
                            thông tin trước khi giao dịch.
                        </Text>
                    </Space>
                </div>

                {/* Copyright */}
                <Row justify="center">
                    <Col>
                        <Text style={{ color: "#adb5bd", textAlign: "center" }}>
                            © 2025 camCheckScam. Bảo lưu mọi quyền.
                        </Text>
                    </Col>
                </Row>
            </div>
        </Footer>
    );
}
