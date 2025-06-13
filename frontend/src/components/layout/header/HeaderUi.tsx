"use client";

import { Layout, Menu, Button, Space, Divider, Dropdown, Avatar } from "antd";
import {
    HomeOutlined,
    UserOutlined,
    SettingOutlined,
    DownOutlined,
    MenuOutlined,
    DropboxOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header } = Layout;

const items: MenuProps["items"] = [
    {
        label: "Trang chủ",
        key: "home",
        icon: <HomeOutlined />,
    },
    {
        label: "Giới thiệu",
        key: "about",
    },
    {
        label: "Sản phẩm",
        key: "products",
        children: [
            {
                label: "Sản phẩm 1",
                key: "product1",
            },
            {
                label: "Sản phẩm 2",
                key: "product2",
            },
        ],
    },
    {
        label: "Liên hệ",
        key: "contact",
    },
];

const userMenuItems: MenuProps["items"] = [
    {
        label: "Hồ sơ cá nhân",
        key: "profile",
        icon: <UserOutlined />,
    },
    {
        label: "Cài đặt",
        key: "settings",
        icon: <SettingOutlined />,
    },
    {
        type: "divider",
    },
    {
        label: "Đăng xuất",
        key: "logout",
    },
];

export default function AppHeader() {
    return (
        <div
            style={{
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 24px",
                }}
            >
                <Header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        background: "transparent",
                        padding: "0",
                        height: "64px",
                    }}
                >
                    {/* Logo */}
                    <div style={{ marginRight: "24px" }}>
                        <Space>
                            <DropboxOutlined style={{ fontSize: "24px" }} />
                            <span
                                style={{ fontWeight: "bold", fontSize: "18px" }}
                            >
                                BankGuard
                            </span>
                        </Space>
                    </div>

                    {/* Menu chính */}
                    <Menu
                        mode="horizontal"
                        items={items}
                        style={{ flex: 1, minWidth: 0, borderBottom: "none" }}
                    />

                    {/* Các action */}
                    <Space size="middle">
                        <Button type="text">Đăng nhập</Button>
                        <Button type="primary">Đăng ký</Button>

                        {/* Dropdown user (hiển thị khi đã đăng nhập) */}
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            trigger={["click"]}
                        >
                            {/* <Space>
                                <Avatar icon={<UserOutlined />} />
                            </Space> */}
                        </Dropdown>

                        {/* Nút menu mobile (chỉ hiển thị trên mobile) */}
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            style={{ display: "none" }}
                            className="mobile-menu-btn"
                        />
                    </Space>
                </Header>
            </div>
        </div>
    );
}
