"use client";

import { Layout, Menu, Typography, Dropdown, Button, Grid, Drawer } from "antd";
import {
    BookOutlined,
    HomeOutlined,
    TrophyOutlined,
    SearchOutlined,
    UserOutlined,
    LoginOutlined,
    UserAddOutlined,
    MenuOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";

const { Header } = Layout;
const { useBreakpoint } = Grid;

export default function HeaderUi() {
    const screens = useBreakpoint();
    const [drawerVisible, setDrawerVisible] = useState(false);

    const userMenuItems = [
        {
            key: "login",
            icon: <LoginOutlined />,
            label: <Link href="/login">Đăng nhập</Link>,
        },
        {
            key: "register",
            icon: <UserAddOutlined />,
            label: <Link href="/register">Đăng ký</Link>,
        },
    ];

    const mainMenuItems = [
        {
            key: "home",
            icon: <HomeOutlined />,
            label: (
                <Link href="/" onClick={() => setDrawerVisible(false)}>
                    Trang chủ
                </Link>
            ),
        },
        {
            key: "theloai",
            icon: <BookOutlined />,
            label: (
                <Link href="/the-loai" onClick={() => setDrawerVisible(false)}>
                    Thể loại
                </Link>
            ),
        },
        {
            key: "rank",
            icon: <TrophyOutlined />,
            label: (
                <Link
                    href="/bang-xep-hang"
                    onClick={() => setDrawerVisible(false)}
                >
                    Bảng xếp hạng
                </Link>
            ),
        },
        {
            key: "search",
            icon: <SearchOutlined />,
            label: (
                <Link href="/tim-kiem" onClick={() => setDrawerVisible(false)}>
                    Tìm kiếm
                </Link>
            ),
        },
    ];

    return (
        <Header
            style={{
                backgroundColor: "#ffffff",
                padding: screens.xs ? "0 16px" : "0 50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #f0f0f0",
                height: 64,
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
        >
            {/* Logo */}
            <Typography.Title level={4} style={{ margin: 0, color: "#222" }}>
                Momolo
            </Typography.Title>

            {/* Cho màn hình lớn */}
            {screens.md ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                    }}
                >
                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={["home"]}
                        style={{
                            background: "transparent",
                            borderBottom: "none",
                        }}
                        items={mainMenuItems}
                    />

                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        arrow
                    >
                        <Button icon={<UserOutlined />}>Tài khoản</Button>
                    </Dropdown>
                </div>
            ) : (
                /* Cho màn hình nhỏ */
                <>
                    <Button
                        icon={<MenuOutlined />}
                        onClick={() => setDrawerVisible(true)}
                    />

                    <Drawer
                        title="Menu"
                        placement="right"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        width={250}
                    >
                        <Menu
                            mode="vertical"
                            defaultSelectedKeys={["home"]}
                            style={{ borderRight: "none" }}
                            items={[
                                ...mainMenuItems,
                                ...userMenuItems.map((item) => ({
                                    ...item,
                                    label: item.label.props.onClick ? (
                                        item.label
                                    ) : (
                                        <span
                                            onClick={() =>
                                                setDrawerVisible(false)
                                            }
                                        >
                                            {item.label}
                                        </span>
                                    ),
                                })),
                            ]}
                        />
                    </Drawer>
                </>
            )}
        </Header>
    );
}
