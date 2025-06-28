"use client";

import { useExpiredSession } from "@/util/serverRequestHandler";
import { Card, Col, Row, Statistic, Typography, Alert } from "antd";

interface Props {
    analytics: {
        users: {
            total: number;
            newThisMonth: number;
            growthRatePercent: number;
            banned: number;
        };
        posts: {
            total: number;
            approved: number;
            rejected: number;
            growthRatePercent: number;
            monthlyBreakdown: {
                month: string;
                count: number;
            }[];
        };
    };
    expiredToken: boolean;
}

export default function AdminViewUi({ analytics, expiredToken }: Props) {
    useExpiredSession(!!expiredToken);

    if (!analytics) {
        return (
            <Alert
                message="Không thể tải dữ liệu"
                description="Đã xảy ra lỗi khi tải dữ liệu thống kê."
                type="error"
                showIcon
            />
        );
    }

    const { users, posts } = analytics;

    return (
        <div style={{ padding: 16 }}>
            <Typography.Title level={3}>Thống kê hệ thống</Typography.Title>

            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng người dùng"
                            value={users.total}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Người dùng mới tháng này"
                            value={users.newThisMonth}
                            suffix={`(+${users.growthRatePercent}%)`}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Người dùng bị cấm"
                            value={users.banned}
                            valueStyle={{ color: "#ff4d4f" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng bài viết" value={posts.total} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đã duyệt"
                            value={posts.approved}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Bị từ chối"
                            value={posts.rejected}
                            valueStyle={{ color: "#f5222d" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tăng trưởng bài viết"
                            value={posts.growthRatePercent}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
