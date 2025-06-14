"use client";

import { requestApiLoginUser } from "@/util/actions";
import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { Rule } from "rc-field-form/lib/interface";
import { useState } from "react";

export default function LoginUi() {
    const [form] = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values: any) => {
        setIsLoading(true);

        try {
            const result = await requestApiLoginUser(values);
            if (result.statusCode === 201) {
                message.success(result.data?.message);
                // setIsModalOpen(true);
            } else if (result.statusCode === 400) {
                message.warning(result.message);
            } else if (result.statusCode === 401) {
                message.warning(result.message);
            } else {
                message.error(result.message);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    // Rules validation đơn giản chỉ kiểm tra không để trống
    const requiredRule: Rule[] = [
        { required: true, message: "Trường này không được để trống" },
    ];

    return (
        <div
            style={{
                maxWidth: 800,
                margin: "24px auto",
                padding: 24,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <h1
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 24,
                }}
            >
                Đăng nhập tài khoản
            </h1>

            <Form
                form={form}
                name="login"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item label="Email" name="email" rules={requiredRule}>
                    <Input placeholder="Nhập email của bạn" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={requiredRule}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full"
                        size="large"
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
