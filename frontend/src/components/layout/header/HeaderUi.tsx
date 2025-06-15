"use client";

import {
    Layout,
    Menu,
    Button,
    Space,
    Divider,
    Dropdown,
    Avatar,
    message,
} from "antd";
import {
    HomeOutlined,
    UserOutlined,
    SettingOutlined,
    DownOutlined,
    MenuOutlined,
    DropboxOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import Link from "next/link";
import { requestApiLogoutUser } from "@/util/actions";

const { Header } = Layout;

const items: MenuProps["items"] = [
    {
        label: <Link href="/">Trang chủ</Link>,
        key: "home",
        icon: <HomeOutlined />,
    },
    {
        label: <Link href="/about">Giới thiệu</Link>,
        key: "about",
    },
    {
        label: "Sản phẩm",
        key: "products",
        children: [
            {
                label: <Link href="/products/1">Sản phẩm 1</Link>,
                key: "product1",
            },
            {
                label: <Link href="/products/2">Sản phẩm 2</Link>,
                key: "product2",
            },
        ],
    },
    {
        label: <Link href="/contact">Liên hệ</Link>,
        key: "contact",
    },
];

const userMenuItems: MenuProps["items"] = [
    {
        label: <Link href="/profile">Hồ sơ cá nhân</Link>,
        key: "profile",
        icon: <UserOutlined />,
    },
    {
        label: <Link href="/settings">Cài đặt</Link>,
        key: "settings",
        icon: <SettingOutlined />,
    },
    {
        type: "divider",
    },
    {
        label: "Đăng xuất",
        key: "logout", // xử lý riêng bằng onClick
    },
];

const HeaderUi = () => {
    const handleUserMenuClick: MenuProps["onClick"] = async (e) => {
        if (e.key === "logout") {
            console.log("hello");
            try {
                await requestApiLogoutUser();
                message.success("Đăng xuất thành công");
            } catch (error) {
                message.error("Có lỗi đã xảy ra");
            }
        }
    };
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
                        <Link href="/login">
                            <Button type="text">Đăng nhập</Button>
                        </Link>
                        <Link href="/register">
                            <Button type="primary">Đăng ký</Button>
                        </Link>

                        {/* Dropdown user (hiển thị khi đã đăng nhập) */}
                        <Dropdown
                            menu={{
                                items: userMenuItems,
                                onClick: handleUserMenuClick,
                            }}
                            trigger={["click"]}
                        >
                            <Space>
                                <Avatar icon={<UserOutlined />} />
                            </Space>
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
};

export default HeaderUi;
