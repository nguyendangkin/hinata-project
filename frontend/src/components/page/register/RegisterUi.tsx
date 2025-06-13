"use client";

import { Button, Form, Input, message } from "antd";
import { Rule } from "antd/es/form";
import { useForm } from "antd/es/form/Form";

export default function RegisterUi() {
    const [form] = useForm();

    const onFinish = (values: any) => {
        // Loại bỏ trường confirmPassword trước khi gửi dữ liệu
        const { confirmPassword, ...submitData } = values;
        console.log("Success:", submitData);
        message.success("Đăng ký thành công!");
        // Gọi API đăng ký ở đây với submitData
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
        message.error("Vui lòng kiểm tra lại thông tin đăng ký");
    };

    // Rules validation
    const displayNameRules: Rule[] = [
        { required: true, message: "Tên hiển thị không được để trống" },
        { max: 34, message: "Tên hiển thị không được vượt quá 34 ký tự" },
    ];

    const emailRules: Rule[] = [
        { required: true, message: "Email không được để trống" },
        { type: "email", message: "Email không đúng định dạng" },
    ];

    const passwordRules: Rule[] = [
        { required: true, message: "Mật khẩu không được để trống" },
        { min: 6, message: "Mật khẩu ít nhất phải có 6 ký tự" },
    ];

    const confirmPasswordRules: Rule[] = [
        { required: true, message: "Vui lòng nhập lại mật khẩu" },
        ({ getFieldValue }) => ({
            validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                }
                return Promise.reject(
                    new Error("Mật khẩu nhập lại không khớp!")
                );
            },
        }),
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
                Đăng ký tài khoản
            </h1>

            <Form
                form={form}
                name="register"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Tên hiển thị"
                    name="displayName"
                    rules={displayNameRules}
                >
                    <Input placeholder="Nhập tên hiển thị (tối đa 34 ký tự)" />
                </Form.Item>

                <Form.Item label="Email" name="email" rules={emailRules}>
                    <Input placeholder="Nhập email của bạn" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={passwordRules}
                >
                    <Input.Password placeholder="Nhập mật khẩu (ít nhất 6 ký tự)" />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={confirmPasswordRules}
                >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full"
                        size="large"
                    >
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
