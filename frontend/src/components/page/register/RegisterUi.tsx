"use client";

import RegisterModalUi from "@/components/page/register/RegisterModalUi";
import { requestApiRegisterUser } from "@/util/actions";
import { Button, Form, Input, message } from "antd";
import { Rule } from "antd/es/form";
import { useForm } from "antd/es/form/Form";
import Link from "next/link";
import { useState } from "react";

export default function RegisterUi() {
    const [form] = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // cái này có thể chuyển qua bên modal cũng được

    const [userEmail, setUserEmail] = useState("");

    const onFinish = async (values: any) => {
        setIsLoading(true);
        // loại bỏ trường confirmPassword trước khi gửi dữ liệu
        const { confirmPassword, ...submitData } = values;
        setUserEmail(submitData.email);

        try {
            const result = await requestApiRegisterUser(submitData);
            if (result.statusCode === 201) {
                message.success(result.data?.message);
                setIsModalOpen(true);
            } else if (result.statusCode === 400) {
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
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Đăng ký
                    </Button>
                </Form.Item>
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Link href="/register">
                        Có tài khoản rồi? <strong>Đăng nhập ngay!</strong>
                    </Link>
                    <br />
                    <Link href="/forgot-password" style={{ marginRight: 16 }}>
                        Quên mật khẩu? <strong>Lấy lại mật khẩu ngay!</strong>
                    </Link>
                </div>
            </Form>
            <RegisterModalUi
                userEmail={userEmail}
                isModalOpen={isModalOpen}
                currentStep={currentStep}
                setIsModalOpen={setIsModalOpen}
                setCurrentStep={setCurrentStep}
            />
        </div>
    );
}
