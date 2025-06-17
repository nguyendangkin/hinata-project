"use client";

import { useEffect, useState } from "react";
import { Button, Modal, Steps, Form, Input, message } from "antd";
import {
    LoadingOutlined,
    SmileOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { Rule } from "antd/es/form";
import { useForm } from "antd/es/form/Form";

import {
    authenticate,
    reqChangePassword,
    reqGetVerifyCodeChangePassword,
    requestApiResendVerifyCodeUser,
    requestApiSendVerifyCodeUser,
    requestApiVerifyCodeUser,
    reqVerifyCodeChangePassword,
} from "@/util/actions";
import { useRouter } from "next/navigation";

interface RegisterModalUiProps {
    userEmail: string;

    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
}

export default function ForgotPasswordModalUi({
    userEmail,

    isModalOpen,
    setIsModalOpen,
}: RegisterModalUiProps) {
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingResendEmail, setIsLoadingResendEmail] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [resetPasswordToken, setResetPasswordToken] = useState<
        string | undefined
    >("");

    const router = useRouter();

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

    // thời gian gửi lại mã xác thực
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    const handleResendCode = async () => {
        setIsLoadingResendEmail(true);
        try {
            const result = await reqGetVerifyCodeChangePassword({
                email: userEmail,
            });
            if (result.statusCode === 201) {
                message.success(result.data?.message);
                setCountdown(60);
            } else if (result.statusCode === 400) {
                message.warning(result.message);
            } else {
                message.error(result.message);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra");
        } finally {
            setIsLoadingResendEmail(false);
        }
    };

    const handleDone = async () => {
        setIsModalOpen(false);
        router.push("/login");
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmitVerifyCode = async (value: any) => {
        setIsLoading(true);
        try {
            const result = await reqVerifyCodeChangePassword(value);

            if (result.statusCode === 201) {
                message.success(result.data?.message);
                setResetPasswordToken(result.data?.resetPasswordToken);
                setCurrentStep(currentStep + 1);
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

    const handleSubmitChangePassword = async (value: any) => {
        const { confirmPassword, ...submitData } = value;
        try {
            const result = await reqChangePassword({
                ...submitData,
                resetPasswordToken,
            });

            if (result.statusCode === 201) {
                message.success(result.data?.message);
                setCurrentStep(currentStep + 1);
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

    return (
        <>
            <Modal
                title="Xác thực lại tài khoản"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={false}
                footer={null}
            >
                <Steps
                    current={currentStep}
                    items={[
                        {
                            title: "Verification",
                            status:
                                currentStep > 0
                                    ? "finish"
                                    : currentStep === 0
                                    ? "process"
                                    : "wait",
                            icon: <SolutionOutlined />,
                        },
                        {
                            title: "Done",
                            status: currentStep === 1 ? "finish" : "wait",
                            icon: <SmileOutlined />,
                        },
                    ]}
                />

                {/* Nội dung từng bước */}
                {currentStep === 0 && (
                    <div style={{ marginTop: 20 }}>
                        <Form
                            onFinish={handleSubmitVerifyCode}
                            initialValues={{ email: userEmail }}
                        >
                            <Form.Item name="email">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                name="activationCode"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã xác thức",
                                    },
                                ]}
                                normalize={(value) => value?.trim()}
                            >
                                <Input placeholder="Xác thực mã" />
                            </Form.Item>
                            <div>
                                <Button
                                    style={{ marginRight: 8 }}
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    Xác thực
                                </Button>
                                <Button
                                    onClick={handleResendCode}
                                    disabled={
                                        countdown > 0 || isLoadingResendEmail
                                    }
                                    loading={isLoadingResendEmail}
                                >
                                    {countdown > 0
                                        ? `Gửi lại mã sau ${countdown}s`
                                        : "Gửi lại mã xác thực"}
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}

                {currentStep === 1 && (
                    <div style={{ marginTop: 20 }}>
                        <Form
                            name="register"
                            layout="vertical"
                            onFinish={handleSubmitChangePassword}
                            initialValues={{ email: userEmail }}
                            autoComplete="off"
                        >
                            <Form.Item name="email">
                                <Input disabled />
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
                            <div>
                                <Button
                                    style={{ marginRight: 8 }}
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    Xác thực
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
                {currentStep === 2 && (
                    <div style={{ marginTop: 20, textAlign: "center" }}>
                        <SmileOutlined
                            style={{ fontSize: 48, color: "#52c41a" }}
                        />
                        <p>Đổi mật khẩu tài khoản thành công!</p>
                        <Button type="primary" onClick={handleDone}>
                            Xong. Đăng nhập ngay!
                        </Button>
                    </div>
                )}
            </Modal>
        </>
    );
}
