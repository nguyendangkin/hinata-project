"use client";

import { Layout, Row, Col, Typography, Grid } from "antd";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;

export default function FooterUi() {
    const screens = useBreakpoint();

    return (
        <Footer
            style={{
                backgroundColor: "#f9f9f9",
                color: "#333",
                padding: screens.xs ? "24px 16px" : "50px 80px",
            }}
        >
            <Row gutter={[32, 32]}>
                <Col xs={24} sm={12} md={8}>
                    <Title level={5} style={{ color: "#000" }}>
                        Momolo Truyện
                    </Title>
                    <Text
                        style={{
                            color: "#666",
                            display: "block",
                            marginTop: 8,
                        }}
                    >
                        Nền tảng đọc truyện tranh và tiểu thuyết với giao diện
                        tinh tế, dễ đọc, tối ưu trải nghiệm người dùng.
                    </Text>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Title level={5} style={{ color: "#000" }}>
                        Liên kết nhanh
                    </Title>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            marginTop: 8,
                        }}
                    >
                        <Link href="/">Trang chủ</Link>
                        <Link href="/the-loai">Thể loại</Link>
                        <Link href="/bang-xep-hang">Bảng xếp hạng</Link>
                        <Link href="/lich-su">Lịch sử đọc</Link>
                    </div>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Title level={5} style={{ color: "#000" }}>
                        Hỗ trợ
                    </Title>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            marginTop: 8,
                        }}
                    >
                        <Link href="/lien-he">Liên hệ</Link>
                        <Link href="/bao-loi">Báo lỗi</Link>
                        <Link href="/terms">Điều khoản</Link>
                        <Link href="/privacy">Chính sách bảo mật</Link>
                    </div>
                </Col>
            </Row>

            <div
                style={{
                    borderTop: "1px solid #ddd",
                    marginTop: 40,
                    paddingTop: 20,
                    textAlign: "center",
                }}
            >
                <Text type="secondary" style={{ fontSize: 13 }}>
                    © {new Date().getFullYear()} Momolo.io.vn. All rights
                    reserved.
                </Text>
                {!screens.xs && <br />}
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Made with ❤️ for cộng đồng yêu truyện Việt.
                </Text>
            </div>
        </Footer>
    );
}
