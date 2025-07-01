"use client";

import { useState } from "react";
import {
    Layout,
    Menu,
    Button,
    Space,
    Dropdown,
    Avatar,
    message,
    Typography,
    Drawer,
} from "antd";
import {
    UserOutlined,
    DownOutlined,
    MenuOutlined,
    SearchOutlined,
    LoginOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import Link from "next/link";
import { requestApiLogoutUser } from "@/util/actions";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";

// Thêm CSS trực tiếp vào file để dễ quản lý
const stylesCss = `
    .desktop-menu {
        display: block;
    }
    .mobile-menu-btn {
        display: none;
    }
    @media (max-width: 768px) {
        .desktop-menu {
            display: none;
        }
        .mobile-menu-btn {
            display: block;
        }
    }
`;

const { Header } = Layout;
const { Text } = Typography;

// Menu chính
const items: MenuProps["items"] = [
    {
        label: <Link href="/">Check scam</Link>,
        key: "/",
        icon: <SearchOutlined />,
    },
    {
        label: <Link href="/post">Tố cáo</Link>,
        key: "/post",
    },
    {
        label: (
            <Link
                href="/donate"
                style={{
                    color: "#fff",
                    backgroundColor: "#52c41a",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontWeight: 600,
                }}
            >
                DONATE
            </Link>
        ),
        key: "/donate",
    },
];

// Menu cho người dùng đã đăng nhập
const userMenuItems = (handleLogout: () => void): MenuProps["items"] => [
    {
        label: <Link href="/profile">Hồ sơ cá nhân</Link>,
        key: "profile",
        icon: <UserOutlined />,
    },
    {
        type: "divider",
    },
    {
        label: "Đăng xuất",
        key: "logout",
        onClick: handleLogout, // Gán hàm logout trực tiếp
    },
];

const HeaderUi = ({ session }: { session: Session | null }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await requestApiLogoutUser();
            message.success("Đăng xuất thành công");
            router.push("/");
            router.refresh();
        } catch (error) {
            message.error("Có lỗi đã xảy ra");
        }
    };

    const showMobileMenu = () => {
        setMobileMenuOpen(true);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const renderUserActions = (isMobile = false) => {
        if (!session?.user) {
            return (
                <Space
                    direction={isMobile ? "vertical" : "horizontal"}
                    style={{ width: isMobile ? "100%" : "auto" }}
                    size="middle"
                >
                    <Link
                        href="/login"
                        style={{ width: isMobile ? "100%" : "auto" }}
                    >
                        <Button
                            type="text"
                            block={isMobile}
                            icon={<LoginOutlined />}
                        >
                            Đăng nhập
                        </Button>
                    </Link>
                    <Link
                        href="/register"
                        style={{ width: isMobile ? "100%" : "auto" }}
                    >
                        <Button
                            type="primary"
                            block={isMobile}
                            icon={<UserAddOutlined />}
                        >
                            Đăng ký
                        </Button>
                    </Link>
                </Space>
            );
        }
        return (
            <Dropdown
                menu={{ items: userMenuItems(handleLogout) }}
                trigger={["click"]}
            >
                <Button
                    type="text"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "4px 8px",
                    }}
                >
                    <Space>
                        <Avatar size="small" icon={<UserOutlined />} />
                        <span>{session.user.displayName}</span>
                        <DownOutlined style={{ fontSize: 12 }} />
                    </Space>
                </Button>
            </Dropdown>
        );
    };

    return (
        <>
            <style>{stylesCss}</style>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    width: "100%",
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
                            justifyContent: "space-between",
                            background: "transparent",
                            padding: "0",
                            height: "64px",
                        }}
                    >
                        {/* Logo */}
                        <div style={{ marginRight: "24px" }}>
                            <Link href="/">
                                <Text
                                    strong
                                    style={{
                                        fontSize: "18px",
                                        cursor: "pointer",
                                    }}
                                >
                                    camCheckScam
                                </Text>
                            </Link>
                        </div>

                        {/* Menu chính (desktop) */}
                        <div className="desktop-menu" style={{ flex: 1 }}>
                            <Menu
                                mode="horizontal"
                                items={items}
                                selectedKeys={[pathname]}
                                style={{ borderBottom: "none" }}
                            />
                        </div>

                        {/* Actions (desktop) */}
                        <div className="desktop-menu">
                            <Space size="middle">{renderUserActions()}</Space>
                        </div>

                        {/* Nút menu (mobile) */}
                        <div className="mobile-menu-btn">
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={showMobileMenu}
                            />
                        </div>
                    </Header>
                </div>
            </div>

            {/* Drawer cho menu mobile */}
            <Drawer
                title="Menu"
                placement="right"
                onClose={closeMobileMenu}
                open={mobileMenuOpen}
                styles={{ body: { padding: 0 } }} // ✨ ĐÃ SỬA LỖI Ở ĐÂY
            >
                <Menu
                    mode="inline"
                    items={items}
                    selectedKeys={[pathname]}
                    onClick={closeMobileMenu} // Đóng menu khi chọn item
                    style={{ borderRight: 0 }}
                />
                <div
                    style={{
                        padding: "16px 24px",
                        borderTop: "1px solid #f0f0f0",
                    }}
                >
                    {renderUserActions(true)}
                </div>
            </Drawer>
        </>
    );
};

export default HeaderUi;
