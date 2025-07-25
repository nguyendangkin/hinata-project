"use client";

import LoginModalUi from "@/components/page/login/LoginModalUi";
import { authenticate, requestApiLoginUser } from "@/util/actions";
import { Button, Form, Input, message, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rule } from "rc-field-form/lib/interface";
import { useState } from "react";

export default function LoginUi() {
    const [form] = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const onFinish = async (values: any) => {
        setIsLoading(true);
        const { email, password } = values;
        setUserEmail(email);
        setUserPassword(password);

        try {
            const result = await authenticate(email, password);
            if (result?.error) {
                if (result?.code === 1) {
                    // sai email hoặc mật khẩu
                    message.warning(result?.error);
                } else if (result?.code === 2) {
                    // tài khoản chưa được kích hoạt
                    setIsModalOpen(true);
                } else {
                    message.warning(result?.error);
                }
            } else {
                message.success("Đăng nhập thành công");
                router.push("/");
                router.refresh();
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
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <Link href="/register">
                            Chưa có tài khoản? <strong>Đăng ký ngay!</strong>
                        </Link>
                        <br />
                        <Link
                            href="/forgot-password"
                            style={{ marginRight: 16 }}
                        >
                            Quên mật khẩu?{" "}
                            <strong>Lấy lại mật khẩu ngay!</strong>
                        </Link>
                    </div>
                </Form>
            </div>
            <LoginModalUi
                userEmail={userEmail}
                userPassword={userPassword}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </>
    );
}
