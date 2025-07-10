"use client";

// Import các thư viện và component cần thiết
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
import { usePRouter } from "@/hooks/usePRouter";
import { convertSlugUrl } from "@/helper/stringify";
import NextLink from "next/link";

// Destructure các component từ Typography và Input
const { Title, Text, Link } = Typography;
const { Search } = Input;

// Interface định nghĩa cấu trúc dữ liệu của một bài viết
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

// Interface định nghĩa props cho component HomeUi
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

// Component HighlightText để highlight từ khóa tìm kiếm
const HighlightText = memo(
    ({
        text,
        searchTerm,
        style = {},
    }: {
        text: string | null | undefined;
        searchTerm: string;
        style?: React.CSSProperties;
    }) => {
        // Chuyển đổi text thành string và xử lý các trường hợp null/undefined
        const textString = text?.toString() || "";

        if (!searchTerm || !textString) {
            return <span style={style}>{textString}</span>;
        }

        // Tạo regex để tìm kiếm không phân biệt hoa thường
        const regex = new RegExp(
            `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
            "gi"
        );
        const parts = textString.split(regex);

        return (
            <span style={style}>
                {parts.map((part, index) =>
                    regex.test(part) ? (
                        <span
                            key={index}
                            style={{
                                backgroundColor: "#fff3cd",
                                color: "#856404",
                                padding: "1px 2px",
                                borderRadius: "2px",
                                fontWeight: "bold",
                            }}
                        >
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    }
);

HighlightText.displayName = "HighlightText";

// Hàm helper để lấy URL đầy đủ của ảnh
const getFullImageUrl = (path: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

// Component PostCard hiển thị thông tin chi tiết của một bài viết
const PostCard = memo(
    ({ post, searchTerm }: { post: PostData; searchTerm: string }) => {
        const router = usePRouter();

        // Hàm xử lý sao chép link bài viết
        const handleCopyLink = useCallback(() => {
            const link = `${window.location.origin}/scammer/${convertSlugUrl(
                post.bankAccount
            )}-${convertSlugUrl(post.bankAccountName)}-${convertSlugUrl(
                post.bankName
            )}-${post.id}.html`;
            navigator.clipboard.writeText(link);
            message.success("Đã sao chép liên kết bài viết!");
        }, [post.id, post.bankAccount, post.bankAccountName, post.bankName]);

        // Hàm xử lý chuyển đến trang chi tiết bài viết
        const handleViewPost = useCallback(() => {
            router.push(
                `/scammer/${convertSlugUrl(post.bankAccount)}-${convertSlugUrl(
                    post.bankAccountName
                )}-${convertSlugUrl(post.bankName)}-${post.id}.html`
            );
        }, [post.id, router]);

        // Render images with consistent styling - tạo styles một lần
        const imageStyles = useMemo(
            () => ({
                imageContainer: {
                    width: 60,
                    height: 60,
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    objectFit: "cover" as const,
                },
                placeholder: {
                    width: 60,
                    height: 60,
                    background: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                },
                moreIndicator: {
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
                },
            }),
            []
        );

        // Render proof images
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
                                    <div style={imageStyles.placeholder}>
                                        <Text type="secondary">Loading...</Text>
                                    </div>
                                }
                                style={imageStyles.imageContainer}
                            />
                        ))}
                        {post.proofImages.length > 3 && (
                            <div style={imageStyles.moreIndicator}>
                                +{post.proofImages.length - 3}
                            </div>
                        )}
                    </Space>
                </Image.PreviewGroup>
            );
        }, [post.proofImages, imageStyles]);

        return (
            <Card
                style={{ marginBottom: 16 }}
                styles={{ body: { padding: "16px" } }}
            >
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
                        <Text
                            strong
                            style={{ fontSize: "16px", color: "#1890ff" }}
                        >
                            <HighlightText
                                text={post.id}
                                searchTerm={searchTerm}
                            />
                        </Text>
                        <Divider
                            type="vertical"
                            style={{ margin: 0, height: "1em" }}
                        />
                        <Text style={{ fontSize: "15px" }}>
                            <HighlightText
                                text={post.displayName}
                                searchTerm={searchTerm}
                            />
                        </Text>
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
                            Xem ở tab đơn →
                        </Button>
                    </div>
                </div>

                <Divider style={{ margin: "12px 0" }} />

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
                                <HighlightText
                                    text={post.bankAccountName}
                                    searchTerm={searchTerm}
                                />
                            </div>
                            <div>
                                <Text strong>Số tài khoản (ngân hàng): </Text>
                                <HighlightText
                                    text={post.bankAccount}
                                    searchTerm={searchTerm}
                                    style={{ fontFamily: "monospace" }}
                                />
                            </div>
                            <div>
                                <Text strong>Tên ngân hàng: </Text>
                                <HighlightText
                                    text={post.bankName}
                                    searchTerm={searchTerm}
                                />
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
                                    <Link
                                        href={post.facebookLink}
                                        target="_blank"
                                    >
                                        <HighlightText
                                            text={post.facebookLink}
                                            searchTerm={searchTerm}
                                        />
                                    </Link>
                                ) : (
                                    <Text type="secondary">
                                        Không có thông tin
                                    </Text>
                                )}
                            </div>
                            <div>
                                <Text strong>
                                    Số điện thoại (hoặc là ZaloPay, MoMo, v.v.):{" "}
                                </Text>
                                {post.phoneNumber ? (
                                    <Link href={`tel:${post.phoneNumber}`}>
                                        <HighlightText
                                            text={post.phoneNumber}
                                            searchTerm={searchTerm}
                                        />
                                    </Link>
                                ) : (
                                    <Text type="secondary">
                                        Không có thông tin
                                    </Text>
                                )}
                            </div>
                            <div>
                                <Text strong>Link báo cáo: </Text>
                                {post.reportLink ? (
                                    <Link
                                        href={post.reportLink}
                                        target="_blank"
                                    >
                                        <HighlightText
                                            text={post.reportLink}
                                            searchTerm={searchTerm}
                                        />
                                    </Link>
                                ) : (
                                    <Text type="secondary">
                                        Không có thông tin
                                    </Text>
                                )}
                            </div>
                        </Space>
                    </Col>
                </Row>

                <div style={{ marginTop: 16 }}>
                    <Text strong>Hình ảnh minh chứng:</Text>
                    <div style={{ marginTop: 8 }}>{renderProofImages}</div>
                </div>

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
                            <HighlightText
                                text={post.comment}
                                searchTerm={searchTerm}
                            />
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
    }
);

PostCard.displayName = "PostCard";

// Component SearchSection xử lý phần tìm kiếm
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
                {/* Phần hướng dẫn tìm kiếm */}
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
                                    kết đến trang cá nhân của NGUYEN VAN A". Vào
                                    trong trang cá nhân của họ, ở mục có ba dấu
                                    chấm)
                                </li>
                            </ul>
                            <div>
                                ❗Nếu mọi thứ không có kết quả, thì bạn hãy cẩn
                                thận suy xét, vì đó có thể đó là một Scammer
                                mới.
                            </div>
                        </Text>
                    </div>
                </div>

                {/* Thanh tìm kiếm */}
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

// Component chính HomeUi
const HomeUi = (props: IProps) => {
    const { data = [], meta, searchTerm = "" } = props;
    const [searchValue, setSearchValue] = useState(searchTerm);
    const [isSearching, setIsSearching] = useState(false);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = usePRouter();

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentSearchRef = useRef(searchTerm);

    useEffect(() => {
        if (searchTerm !== currentSearchRef.current) {
            setSearchValue(searchTerm);
            currentSearchRef.current = searchTerm;
            setIsSearching(false);
        }
    }, [searchTerm]);

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
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [searchParams, pathname, router]
    );

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

    const handlePressEnter = useCallback(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        handleSearch(searchValue);
        setIsSearching(false);
    }, [handleSearch, searchValue]);

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const handlePaginationChange = useCallback(
        (page: number, pageSize: number) => {
            const params = new URLSearchParams(searchParams);
            params.set("current", page.toString());
            params.set("pageSize", pageSize.toString());
            router.push(`${pathname}?${params.toString()}`);
        },
        [searchParams, router, pathname]
    );

    // Memoize postCards with stable key
    const postCards = useMemo(() => {
        if (!data || data.length === 0) return null;

        return data.map((post) => (
            <PostCard
                key={`${post.id}-${post.key}`}
                post={post}
                searchTerm={searchTerm}
            />
        ));
    }, [data, searchTerm]);

    return (
        <div style={{ marginBottom: 32 }}>
            <SearchSection
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onPressEnter={handlePressEnter}
                isSearching={isSearching}
            />

            <div style={{ marginBottom: 24 }}>
                {postCards ? (
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

            {data.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 24,
                    }}
                >
                    <Pagination
                        current={meta.current}
                        total={meta.total}
                        pageSize={meta.pageSize}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        size="default"
                        onChange={handlePaginationChange}
                        itemRender={(page, type, originalElement) => {
                            if (type === "page") {
                                const params = new URLSearchParams(
                                    searchParams
                                );
                                params.set("current", page.toString());
                                params.set(
                                    "pageSize",
                                    meta.pageSize.toString()
                                );

                                return (
                                    <NextLink
                                        href={`${pathname}?${params.toString()}`}
                                    >
                                        {page}
                                    </NextLink>
                                );
                            }
                            return originalElement;
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default HomeUi;
