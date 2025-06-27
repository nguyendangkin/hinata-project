"use client";

import {
    Card,
    Input,
    Typography,
    Space,
    Pagination,
    Image,
    Tag,
    Row,
    Col,
    Divider,
    Button,
} from "antd";
import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useExpiredSession } from "@/util/serverRequestHandler";
import { CopyOutlined } from "@ant-design/icons";
import { message } from "antd";

const { Title, Text, Link } = Typography;
const { Search } = Input;

// Interface cho dữ liệu bài viết
interface PostData {
    key: string;
    id: string;
    displayName: string;
    bankAccountName: string;
    phoneNumber: string;
    bankAccount: string;
    bankName: string;
    facebookLink: string;
    reportLink: string;
    proofImages: string[];
    comment: string;
    status: "pending" | "approved" | "rejected";
}

// Interface cho props
interface IProps {
    data: PostData[];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    searchTerm?: string;
}

// Hàm lấy URL đầy đủ cho ảnh
const getFullImageUrl = (path: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

// Memoized component cho từng card post
const PostCard = memo(({ post }: { post: PostData }) => {
    const router = useRouter();

    // Memoize hàm render ảnh
    const renderProofImages = useMemo(() => {
        if (!post.proofImages || post.proofImages.length === 0) return null;

        const fullImages = post.proofImages.map(getFullImageUrl);

        return (
            <Image.PreviewGroup items={fullImages}>
                <Space size={4}>
                    {post.proofImages.slice(0, 3).map((img, index) => (
                        <Image
                            key={index}
                            src={getFullImageUrl(img)}
                            width={60}
                            height={60}
                            alt={`Minh chứng ${index + 1}`}
                            loading="lazy"
                            placeholder={
                                <div
                                    style={{
                                        width: 60,
                                        height: 60,
                                        background: "#f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text type="secondary">Loading...</Text>
                                </div>
                            }
                            style={{
                                border: "1px solid #d1d5db",
                                objectFit: "cover",
                                borderRadius: "4px",
                            }}
                        />
                    ))}
                    {post.proofImages.length > 3 && (
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "60px",
                                height: "60px",
                                border: "1px solid #d1d5db",
                                backgroundColor: "#f3f4f6",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            +{post.proofImages.length - 3}
                        </div>
                    )}
                </Space>
            </Image.PreviewGroup>
        );
    }, [post.proofImages]);

    // Memoize các hàm handler
    const handleCopyLink = useCallback(() => {
        const link = `${window.location.origin}/scammer/${post.id}`;
        navigator.clipboard.writeText(link);
        message.success("Đã sao chép liên kết bài viết!");
    }, [post.id]);

    const handleViewPost = useCallback(() => {
        router.push(`/scammer/${post.id}`);
    }, [post.id, router]);

    return (
        <Card
            style={{ marginBottom: 16 }}
            styles={{ body: { padding: "16px" } }}
        >
            {/* Header với ID, displayName */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    gap: 8,
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                        flexWrap: "wrap",
                    }}
                >
                    <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
                        {post.id}
                    </Text>
                    <Divider
                        type="vertical"
                        style={{ margin: 0, height: "1em" }}
                    />
                    <Text style={{ fontSize: "15px" }}>{post.displayName}</Text>
                    <Divider
                        type="vertical"
                        style={{ margin: 0, height: "1em" }}
                    />
                </div>

                <Tag
                    color={
                        post.status === "approved"
                            ? "green"
                            : post.status === "rejected"
                            ? "red"
                            : "orange"
                    }
                    style={{
                        marginLeft: "auto",
                        borderRadius: "4px",
                    }}
                >
                    {post.status.toUpperCase()}
                </Tag>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        icon={<CopyOutlined />}
                        size="small"
                        onClick={handleCopyLink}
                    >
                        Sao chép liên kết
                    </Button>
                </div>
                <div style={{ textAlign: "right" }}>
                    <Button type="link" onClick={handleViewPost}>
                        Xem ở tab đơn &rarr;
                    </Button>
                </div>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            {/* Thông tin chi tiết */}
            <Row gutter={[16, 8]}>
                <Col xs={24} sm={12}>
                    <Space
                        direction="vertical"
                        size={4}
                        style={{ width: "100%" }}
                    >
                        <div>
                            <Text strong>
                                Họ và tên (tài khoản ngân hàng):{" "}
                            </Text>
                            <Text>{post.bankAccountName}</Text>
                        </div>
                        <div>
                            <Text strong>Số tài khoản (ngân hàng): </Text>
                            <Text style={{ fontFamily: "monospace" }}>
                                {post.bankAccount}
                            </Text>
                        </div>
                        <div>
                            <Text strong>Tên ngân hàng: </Text>
                            <Text>{post.bankName}</Text>
                        </div>
                    </Space>
                </Col>

                <Col xs={24} sm={12}>
                    <Space
                        direction="vertical"
                        size={4}
                        style={{ width: "100%" }}
                    >
                        <div>
                            <Text strong>Trang facebook cá nhân: </Text>
                            {post.facebookLink ? (
                                <Link href={post.facebookLink} target="_blank">
                                    Xem profile
                                </Link>
                            ) : (
                                <Text type="secondary">Không có thông tin</Text>
                            )}
                        </div>
                        <div>
                            <Text strong>
                                Số điện thoại (hoặc là ZaloPay, MoMo, v.v.):{" "}
                            </Text>
                            {post.phoneNumber ? (
                                <Link href={`tel:${post.phoneNumber}`}>
                                    {post.phoneNumber}
                                </Link>
                            ) : (
                                <Text type="secondary">Không có thông tin</Text>
                            )}
                        </div>
                        <div>
                            <Text strong>Link báo cáo: </Text>
                            {post.reportLink ? (
                                <Link href={post.reportLink} target="_blank">
                                    Xem bài viết
                                </Link>
                            ) : (
                                <Text type="secondary">Không có thông tin</Text>
                            )}
                        </div>
                    </Space>
                </Col>
            </Row>

            {/* File - Hình ảnh minh chứng */}
            <div style={{ marginTop: 16 }}>
                <Text strong>Hình ảnh minh chứng:</Text>
                <div style={{ marginTop: 8 }}>{renderProofImages}</div>
            </div>

            {/* Bình luận */}
            {post.comment ? (
                <div style={{ marginTop: 16 }}>
                    <Text strong>Bình luận:</Text>
                    <div
                        style={{
                            marginTop: 4,
                            padding: "8px 12px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "4px",
                            maxHeight: "100px",
                            overflowY: "auto",
                        }}
                    >
                        <Text>{post.comment}</Text>
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: 16 }}>
                    <Text strong>Bình luận:</Text>
                    <div
                        style={{
                            marginTop: 4,
                            padding: "8px 12px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "4px",
                        }}
                    >
                        <Text type="secondary">Không có bình luận</Text>
                    </div>
                </div>
            )}
        </Card>
    );
});

// Đặt displayName cho component
PostCard.displayName = "PostCard";

// Memoized component cho search section
const SearchSection = memo(
    ({
        searchValue,
        onSearchChange,
        onPressEnter,
        isSearching,
    }: {
        searchValue: string;
        onSearchChange: (value: string) => void;
        onPressEnter: () => void;
        isSearching: boolean;
    }) => {
        return (
            <>
                {/* Header */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 32,
                        marginBottom: 32,
                        padding: "0 16px",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "800px",
                            margin: "0 auto",
                            padding: "20px",
                            backgroundColor: "#f0f7ff",
                            borderRadius: "8px",
                            border: "1px solid #d9eaff",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: "15px",
                                color: "#333",
                                textAlign: "left",
                            }}
                        >
                            <div style={{ marginBottom: 8, fontWeight: 500 }}>
                                🔍 Có thể tìm kiếm theo:
                            </div>
                            <ul
                                style={{
                                    margin: 0,
                                    paddingLeft: 20,
                                    listStyleType: "none",
                                }}
                            >
                                <li style={{ marginBottom: 6 }}>
                                    • <Text code>ID bài post</Text> (ví dụ: 12)
                                </li>
                                <li style={{ marginBottom: 6 }}>
                                    • <Text code>Tên chủ tài khoản</Text> (ví
                                    dụ: NGUYEN VAN A)
                                </li>
                                <li style={{ marginBottom: 6 }}>
                                    • <Text code>Số tài khoản</Text> (ví dụ:
                                    123456789)
                                </li>
                                <li style={{ marginBottom: 6 }}>
                                    • <Text code>Số điện thoại</Text> (ví dụ:
                                    0912345678)
                                </li>
                                <li>
                                    • <Text code>Link Facebook</Text> (là "Liên
                                    kết đến trang cá nhân của NGUYEN A". Vào
                                    trong trang cá nhân của họ, ở mục có ba dấu
                                    chấm)
                                </li>
                            </ul>
                        </Text>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: 24 }}>
                    <Input
                        placeholder="Nhập tông tin mà bạn muốn tra"
                        allowClear
                        size="large"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onPressEnter={onPressEnter}
                        style={{ width: "100%" }}
                        prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                    />
                    {isSearching && (
                        <div
                            style={{
                                fontSize: "12px",
                                color: "#666",
                                marginTop: "4px",
                                textAlign: "right",
                            }}
                        >
                            Đang tìm kiếm...
                        </div>
                    )}
                </div>
            </>
        );
    }
);

SearchSection.displayName = "SearchSection";

const HomeUi = (props: IProps) => {
    const { data = [], meta, searchTerm = "" } = props;
    const [searchValue, setSearchValue] = useState(searchTerm);
    const [isSearching, setIsSearching] = useState(false);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Sử dụng useRef để lưu timeout ID
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentSearchRef = useRef(searchTerm);

    // Cập nhật searchValue khi searchTerm thay đổi (từ URL)
    useEffect(() => {
        if (searchTerm !== currentSearchRef.current) {
            setSearchValue(searchTerm);
            currentSearchRef.current = searchTerm;
            setIsSearching(false);
        }
    }, [searchTerm]);

    // Hàm xử lý tìm kiếm
    const handleSearch = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams);
            if (value.trim()) {
                params.set("search", value.trim());
                params.set("current", "1");
            } else {
                params.delete("search");
            }
            currentSearchRef.current = value.trim();
            router.push(`${pathname}?${params.toString()}`);
        },
        [searchParams, pathname, router]
    );

    // Hàm xử lý thay đổi search với debounce tối ưu
    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchValue(value);

            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            if (value.trim() === currentSearchRef.current) {
                setIsSearching(false);
                return;
            }

            setIsSearching(true);

            debounceTimeoutRef.current = setTimeout(() => {
                handleSearch(value);
                setIsSearching(false);
            }, 300);
        },
        [handleSearch]
    );

    // Hàm xử lý khi nhấn Enter
    const handlePressEnter = useCallback(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        handleSearch(searchValue);
        setIsSearching(false);
    }, [handleSearch, searchValue]);

    // Cleanup timeout khi component unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    // Hàm xử lý phân trang
    const handlePaginationChange = useCallback(
        (page: number, pageSize: number) => {
            const params = new URLSearchParams(searchParams);
            params.set("current", page.toString());
            params.set("pageSize", pageSize.toString());
            router.push(`${pathname}?${params.toString()}`);
        },
        [searchParams, router, pathname]
    );

    // Memoize danh sách các PostCard
    const postCards = useMemo(() => {
        return data.map((post) => <PostCard key={post.id} post={post} />);
    }, [data]);

    return (
        <div style={{ marginBottom: 32 }}>
            <SearchSection
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onPressEnter={handlePressEnter}
                isSearching={isSearching}
            />

            {/* Danh sách bài viết */}
            <div style={{ marginBottom: 24 }}>
                {data.length > 0 ? (
                    postCards
                ) : (
                    <Card>
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <Text type="secondary" style={{ fontSize: "16px" }}>
                                Không có dữ liệu để hiển thị
                            </Text>
                        </div>
                    </Card>
                )}
            </div>

            {/* Pagination */}
            {data.length > 0 && (
                <div style={{ textAlign: "center", marginTop: 24 }}>
                    <Pagination
                        current={meta.current}
                        total={meta.total}
                        pageSize={meta.pageSize}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        onChange={handlePaginationChange}
                        showTotal={(total, range) => (
                            <Text type="secondary">
                                {range[0]}-{range[1]} trên {total} bản ghi
                            </Text>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default HomeUi;
