"use client";

import ForgotPasswordModalUi from "@/components/page/forgot-password/ForgotPasswordModalUi";
import LoginModalUi from "@/components/page/login/LoginModalUi";
import {
    authenticate,
    reqGetVerifyCodeChangePassword,
    requestApiLoginUser,
} from "@/util/actions";
import { Button, Form, Input, message, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rule } from "rc-field-form/lib/interface";
import { useState } from "react";

export default function ForgotPasswordUi() {
    const [form] = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const onFinish = async (values: any) => {
        setIsLoading(true);
        const { email } = values;
        setUserEmail(email);

        try {
            const result = await reqGetVerifyCodeChangePassword(values);
            if (result.statusCode === 201) {
                message.success(result.data?.message);
                setIsModalOpen(true);
            } else if (result.statusCode === 400) {
                message.warning(result.message);
            } else {
                message.error(result.message);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi gửi yêu cầu");
        } finally {
            setIsLoading(false);
        }
    };

    // Rules validation cho email
    const emailRules: Rule[] = [
        { required: true, message: "Vui lòng nhập email" },
        { type: "email", message: "Email không đúng định dạng" },
    ];

    return (
        <>
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
                    Lấy lại mật khẩu
                </h1>

                <Form
                    form={form}
                    name="forgotPassword"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item label="Email" name="email" rules={emailRules}>
                        <Input placeholder="Nhập email của bạn" />
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
                            Gửi yêu cầu
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <Link href="/register">
                            Chưa có tài khoản? <strong>Đăng ký ngay!</strong>
                        </Link>
                        <br />
                        <Link href="/login" style={{ marginRight: 16 }}>
                            Có tài khoản rồi?{" "}
                            <strong>Đi đăng nhập ngay!</strong>
                        </Link>
                    </div>
                </Form>
            </div>
            <ForgotPasswordModalUi
                userEmail={userEmail}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </>
    );
}
