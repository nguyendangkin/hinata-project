"use client";

import { Layout, Row, Col, Typography, Space, Divider } from "antd";
import {
    SafetyOutlined,
    MailOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    LinkedinOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

export default function FooterUi() {
    return (
        <Footer
            style={{
                backgroundColor: "#f9fafb",
                color: "#495057",
                padding: "40px 0",
                borderTop: "1px solid #eaecef",
                marginTop: "auto",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 24px",
                }}
            >
                <Row gutter={[32, 32]}>
                    {/* Giới thiệu */}
                    <Col xs={24} sm={12} md={8}>
                        <Space direction="vertical" size="middle">
                            <div>
                                <WarningOutlined
                                    style={{
                                        fontSize: "24px",
                                        color: "#fa541c",
                                        marginRight: "8px",
                                    }}
                                />
                                <Title
                                    level={4}
                                    style={{
                                        color: "#212529",
                                        margin: 0,
                                        display: "inline",
                                        fontWeight: 600,
                                    }}
                                >
                                    camCheckScam
                                </Title>
                            </div>
                            <Text style={{ color: "#6c757d" }}>
                                camCheckScam là nền tảng giúp bạn tra cứu, xác
                                minh và báo cáo các hành vi lừa đảo liên quan
                                đến tài khoản ngân hàng và giao dịch trực tuyến.
                                Cùng nhau bảo vệ cộng đồng khỏi những mối đe dọa
                                ảo.
                            </Text>
                            <Space>
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

                    {/* Hỗ trợ và Liên hệ */}
                    <Col xs={24} sm={12} md={8}>
                        <Title
                            level={5}
                            style={{ color: "#212529", fontWeight: 500 }}
                        >
                            Hỗ trợ & Liên hệ
                        </Title>
                        <Space direction="vertical" size="small">
                            <Space direction="vertical" size="small">
                                <Space>
                                    <MailOutlined
                                        style={{ color: "#6c757d" }}
                                    />
                                    <Typography.Link href="mailto:kinnguyendang@gmail.com">
                                        kinnguyendang@gmail.com
                                    </Typography.Link>
                                </Space>
                            </Space>
                            <Text style={{ color: "#6c757d" }}>
                                Nếu bạn gặp vấn đề hoặc phát hiện nội dung đáng
                                nghi, vui lòng liên hệ với chúng tôi qua email
                                để được hỗ trợ hoặc báo cáo kịp thời.
                            </Text>
                        </Space>
                    </Col>

                    {/* Dịch vụ */}
                    <Col xs={24} sm={12} md={8}>
                        <Title
                            level={5}
                            style={{ color: "#212529", fontWeight: 500 }}
                        >
                            <SafetyOutlined
                                style={{ marginRight: "8px", color: "#6c757d" }}
                            />
                            Dịch vụ
                        </Title>
                        <Space direction="vertical" size="small">
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
                    <Space>
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
                <Row justify="space-between" align="middle">
                    <Col>
                        <Text style={{ color: "#adb5bd" }}>
                            © 2024 camCheckScam. Bảo lưu mọi quyền.
                        </Text>
                    </Col>
                    <Col>
                        <Space
                            split={<span style={{ color: "#e9ecef" }}>|</span>}
                        >
                            <Link style={{ color: "#adb5bd" }} href="#">
                                Chính sách bảo mật
                            </Link>
                            <Link style={{ color: "#adb5bd" }} href="#">
                                Điều khoản sử dụng
                            </Link>
                        </Space>
                    </Col>
                </Row>
            </div>
        </Footer>
    );
}
