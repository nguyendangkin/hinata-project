"use client";

import { requestApiRegisterUser } from "@/util/actions";
import { Button, Form, Input, Card, Grid, notification, message } from "antd";
import type { FormProps } from "antd";
import { useState } from "react";

const { useBreakpoint } = Grid;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

export default function RegisterUi() {
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const [loading, setLoading] = useState(false);

    const onFinish: FormProps["onFinish"] = async (values) => {
        setLoading(true);
        const backendData = {
            displayName: values.displayName.trim(),
            email: values.email.trim(),
            password: values.password,
        };
        // gọi api
        try {
            const result = await requestApiRegisterUser(backendData);
            if (result.statusCode === 201) {
                message.success(result.data?.message);
            } else if (result.statusCode === 400) {
                message.warning(result.message);
            } else {
                message.error(result.message);
            }
        } catch (error) {
            message.error("Đã có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "50vh",
                padding: screens.xs ? "16px" : "24px",
            }}
        >
            <Card
                title="Đăng ký tài khoản"
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item
                        name="displayName"
                        label="Tên hiển thị"
                        rules={[
                            {
                                required: true,
                                message: "Tên hiển thị không được để trống",
                            },
                            {
                                max: 34,
                                message:
                                    "Tên hiển thị không được vượt quá 34 ký tự",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                type: "email",
                                message: "Email không đúng định dạng",
                            },
                            {
                                required: true,
                                message: "Email không được để trống",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu không được để trống",
                            },
                            {
                                min: 6,
                                message: "Mật khẩu ít nhất phải có 6 ký tự",
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng xác nhận mật khẩu!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Mật khẩu xác nhận không khớp!"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={loading}
                            style={{ width: screens.xs ? "100%" : "auto" }}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
