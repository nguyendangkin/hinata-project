"use client";

import { Layout, Menu, Typography } from "antd";
import {
    BookOutlined,
    HomeOutlined,
    TrophyOutlined,
    SearchOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

export default function HeaderUi() {
    return (
        <Header
            style={{
                backgroundColor: "#ffffff",
                padding: "0 50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #f0f0f0",
                height: 64,
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
        >
            {/* Logo / Tên site */}
            <Typography.Title level={4} style={{ margin: 0, color: "#222" }}>
                Momolo
            </Typography.Title>

            {/* Menu chính */}
            <Menu
                mode="horizontal"
                defaultSelectedKeys={["home"]}
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    background: "transparent",
                    borderBottom: "none",
                }}
                items={[
                    {
                        key: "home",
                        icon: <HomeOutlined />,
                        label: <a href="/">Trang chủ</a>,
                    },
                    {
                        key: "theloai",
                        icon: <BookOutlined />,
                        label: <a href="/the-loai">Thể loại</a>,
                    },
                    {
                        key: "rank",
                        icon: <TrophyOutlined />,
                        label: <a href="/bang-xep-hang">Bảng xếp hạng</a>,
                    },
                    {
                        key: "search",
                        icon: <SearchOutlined />,
                        label: <a href="/tim-kiem">Tìm kiếm</a>,
                    },
                ]}
            />
        </Header>
    );
}
