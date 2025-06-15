"use client";
import { useEffect, useState } from "react";
import { Button, Modal, Steps, Form, Input, message } from "antd";
import {
    LoadingOutlined,
    SmileOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    requestApiResendVerifyCodeUser,
    requestApiVerifyCodeUser,
} from "@/util/actions";
import { useRouter } from "next/navigation";

interface RegisterModalUiProps {
    userEmail: string;
    isModalOpen: boolean;
    currentStep: number;
    setIsModalOpen: (value: boolean) => void;
    setCurrentStep: (value: number) => void;
}

export default function RegisterModalUi({
    userEmail,
    isModalOpen,
    currentStep,
    setIsModalOpen,
    setCurrentStep,
}: RegisterModalUiProps) {
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingResendEmail, setIsLoadingResendEmail] = useState(false);

    const router = useRouter();

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
            const result = await requestApiResendVerifyCodeUser({
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

    const handleDone = () => {
        setIsModalOpen(false);
        router.push("/login");
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (value: any) => {
        setIsLoading(true);
        try {
            const result = await requestApiVerifyCodeUser(value);

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
                title="Basic Modal"
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
                            onFinish={handleSubmit}
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
                    <div style={{ marginTop: 20, textAlign: "center" }}>
                        <SmileOutlined
                            style={{ fontSize: 48, color: "#52c41a" }}
                        />
                        <p>Xác nhận tài khoản thành công!</p>
                        <Button type="primary" onClick={handleDone}>
                            Xong. Đăng nhập ngay!
                        </Button>
                    </div>
                )}
            </Modal>
        </>
    );
}
