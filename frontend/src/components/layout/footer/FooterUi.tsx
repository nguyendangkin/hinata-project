"use client";

import { Layout, Row, Col, Typography, Space, Divider } from "antd";
import {
    SafetyOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    LinkedinOutlined,
    BankOutlined,
    ExclamationCircleOutlined,
    DropboxOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

export default function FooterUi() {
    return (
        <Footer
            style={{
                backgroundColor: "#f8f9fa",
                color: "#495057",
                padding: "40px 0",
                marginTop: "auto",
                borderTop: "1px solid #e9ecef",
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
                    {/* Thông tin chính */}
                    <Col xs={24} sm={12} md={6}>
                        <Space direction="vertical" size="middle">
                            <div>
                                <DropboxOutlined
                                    style={{
                                        fontSize: "24px",
                                        color: "#6c757d",
                                        marginRight: "8px",
                                    }}
                                />
                                <Title
                                    level={4}
                                    style={{
                                        color: "#212529",
                                        margin: 0,
                                        display: "inline",
                                        fontWeight: 500,
                                    }}
                                >
                                    BankGuard
                                </Title>
                            </div>
                            <Text style={{ color: "#6c757d" }}>
                                Bảo vệ bạn khỏi các hình thức lừa đảo qua số tài
                                khoản ngân hàng và giao dịch trực tuyến.
                            </Text>
                            <Space>
                                <FacebookOutlined
                                    style={{
                                        fontSize: "20px",
                                        color: "#6c757d",
                                        cursor: "pointer",
                                    }}
                                />
                                <TwitterOutlined
                                    style={{
                                        fontSize: "20px",
                                        color: "#6c757d",
                                        cursor: "pointer",
                                    }}
                                />
                                <InstagramOutlined
                                    style={{
                                        fontSize: "20px",
                                        color: "#6c757d",
                                        cursor: "pointer",
                                    }}
                                />
                                <LinkedinOutlined
                                    style={{
                                        fontSize: "20px",
                                        color: "#6c757d",
                                        cursor: "pointer",
                                    }}
                                />
                            </Space>
                        </Space>
                    </Col>

                    {/* Dịch vụ */}
                    <Col xs={24} sm={12} md={6}>
                        <Title
                            level={5}
                            style={{
                                color: "#212529",
                                marginBottom: "16px",
                                fontWeight: 500,
                            }}
                        >
                            <SafetyOutlined
                                style={{ marginRight: "8px", color: "#6c757d" }}
                            />
                            Dịch vụ bảo vệ
                        </Title>
                        <Space direction="vertical" size="small">
                            <Link style={{ color: "#6c757d" }} href="#">
                                Kiểm tra số tài khoản
                            </Link>
                            <Link style={{ color: "#6c757d" }} href="#">
                                Báo cáo lừa đảo
                            </Link>
                            <Link style={{ color: "#6c757d" }} href="#">
                                Danh sách đen
                            </Link>
                            <Link style={{ color: "#6c757d" }} href="#">
                                Hướng dẫn an toàn
                            </Link>
                            <Link style={{ color: "#6c757d" }} href="#">
                                Cảnh báo mới nhất
                            </Link>
                        </Space>
                    </Col>

                    {/* Ngân hàng hỗ trợ */}
                    <Col xs={24} sm={12} md={6}>
                        <Title
                            level={5}
                            style={{
                                color: "#212529",
                                marginBottom: "16px",
                                fontWeight: 500,
                            }}
                        >
                            <BankOutlined
                                style={{ marginRight: "8px", color: "#6c757d" }}
                            />
                            Ngân hàng hỗ trợ
                        </Title>
                        <Space direction="vertical" size="small">
                            <Link style={{ color: "#6c757d" }} href="#">
                                Vietcombank
                            </Link>
                            <Link style={{ color: "#6c757d" }} href="#">
                                BIDV
                            </Link>
                            <Link style={{ color: "#6c757d" }} href="#">
                                Agribank
                            </Link>
                            <Link style={{ color: "#6c757d" }} href="#">
                                VietinBank
                            </Link>
                            <Link style={{ color: "#6c757d" }} href="#">
                                Techcombank
                            </Link>
                        </Space>
                    </Col>

                    {/* Liên hệ */}
                    <Col xs={24} sm={12} md={6}>
                        <Title
                            level={5}
                            style={{
                                color: "#212529",
                                marginBottom: "16px",
                                fontWeight: 500,
                            }}
                        >
                            Liên hệ hỗ trợ
                        </Title>
                        <Space direction="vertical" size="small">
                            <Space>
                                <PhoneOutlined style={{ color: "#6c757d" }} />
                                <Text style={{ color: "#6c757d" }}>
                                    1900 0000
                                </Text>
                            </Space>
                            <Space>
                                <MailOutlined style={{ color: "#6c757d" }} />
                                <Text style={{ color: "#6c757d" }}>
                                    support@bankguard.vn
                                </Text>
                            </Space>
                            <Space>
                                <EnvironmentOutlined
                                    style={{ color: "#6c757d" }}
                                />
                                <Text style={{ color: "#6c757d" }}>
                                    Hà Nội, Việt Nam
                                </Text>
                            </Space>
                            <Space>
                                <ExclamationCircleOutlined
                                    style={{ color: "#dc3545" }}
                                />
                                <Text style={{ color: "#dc3545" }}>
                                    Hotline khẩn cấp: 113
                                </Text>
                            </Space>
                        </Space>
                    </Col>
                </Row>

                <Divider
                    style={{ borderColor: "#e9ecef", margin: "32px 0 24px 0" }}
                />

                {/* Cảnh báo quan trọng */}
                <div
                    style={{
                        backgroundColor: "#f8d7da",
                        padding: "16px",
                        borderRadius: "6px",
                        marginBottom: "24px",
                        border: "1px solid #f5c6cb",
                    }}
                >
                    <Space>
                        <ExclamationCircleOutlined
                            style={{ fontSize: "16px", color: "#721c24" }}
                        />
                        <Text strong style={{ color: "#721c24" }}>
                            CẢNH BÁO: Không bao giờ chuyển tiền cho người lạ.
                            Luôn xác minh thông tin trước khi giao dịch!
                        </Text>
                    </Space>
                </div>

                {/* Copyright */}
                <Row justify="space-between" align="middle">
                    <Col>
                        <Text style={{ color: "#adb5bd" }}>
                            © 2024 BankGuard. Bảo lưu mọi quyền.
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
                            <Link style={{ color: "#adb5bd" }} href="#">
                                Sitemap
                            </Link>
                        </Space>
                    </Col>
                </Row>
            </div>
        </Footer>
    );
}
