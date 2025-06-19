"use client";

import React, { useState } from "react";
import { Form, Input, Button, Upload, Card, Space, message, Image } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";

const { TextArea } = Input;

interface FormItem {
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    phoneNumber?: string;
    facebookProfileLink?: string;
    complaintLink?: string;
    personalComment?: string;
    proofFiles?: UploadFile[];
    isEditing?: boolean;
}

const PostUi: React.FC = () => {
    const [form] = Form.useForm();
    const [items, setItems] = useState<FormItem[]>([
        {
            bankAccountName: "",
            bankAccountNumber: "",
            bankName: "",
            phoneNumber: "",
            facebookProfileLink: "",
            complaintLink: "",
            personalComment: "",
            proofFiles: [],
            isEditing: true,
        },
    ]);

    const [previewImage, setPreviewImage] = useState<string>("");
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as any);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewVisible(true);
    };

    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleAddItem = () => {
        const newItem = {
            bankAccountName: "",
            bankAccountNumber: "",
            bankName: "",
            phoneNumber: "",
            facebookProfileLink: "",
            complaintLink: "",
            personalComment: "",
            proofFiles: [],
            isEditing: true,
        };

        // Get current form values
        const currentValues = form.getFieldsValue()?.items || [];

        // Update items state with current form values
        const updatedItems = items.map((item, index) => ({
            ...item,
            ...(currentValues[index] || {}),
            isEditing: false,
        }));

        setItems([...updatedItems, newItem]);

        // Reset form fields for the new item
        form.setFieldsValue({
            items: [
                ...updatedItems.map((item) => ({
                    ...item,
                    isEditing: undefined,
                })),
                newItem,
            ],
        });
    };

    const handleRemoveItem = (index: number) => {
        if (items.length === 1) {
            message.warning("Phải có ít nhất một mục");
            return;
        }

        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);

        // Update form values after removal
        const currentValues = form.getFieldsValue()?.items || [];
        currentValues.splice(index, 1);
        form.setFieldsValue({ items: currentValues });
    };

    const handleEditItem = (index: number) => {
        const newItems = [...items];
        newItems[index].isEditing = !newItems[index].isEditing;
        setItems(newItems);
    };

    const handleSubmit = (values: any) => {
        console.log("Submitted values:", values);
        message.success("Đã gửi thông tin thành công");
    };

    const handleFileChange =
        (index: number): UploadProps["onChange"] =>
        (info) => {
            let newFileList = [...info.fileList];
            newFileList = newFileList.slice(-5);

            const newItems = [...items];
            newItems[index].proofFiles = newFileList;
            setItems(newItems);

            // Update form values
            const currentValues = form.getFieldsValue()?.items || [];
            currentValues[index].proofFiles = newFileList;
            form.setFieldsValue({ items: currentValues });
        };

    const uploadProps = (index: number): UploadProps => ({
        beforeUpload: (file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) message.error("Chỉ được tải lên file ảnh!");
            return isImage || Upload.LIST_IGNORE;
        },
        fileList: items[index].proofFiles,
        onPreview: handlePreview,
        onChange: handleFileChange(index),
        multiple: true,
        accept: "image/*",
        listType: "picture-card",
        disabled: !items[index].isEditing,
        previewFile(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file as any);
                reader.onload = () => resolve(reader.result as string);
            });
        },
    });

    return (
        <div style={{ maxWidth: 800, margin: "25px auto" }}>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                {items.map((item, index) => (
                    <Card
                        key={index}
                        style={{ marginBottom: 16 }}
                        title={`Mục ${index + 1}`}
                        extra={
                            <Space>
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditItem(index)}
                                >
                                    {item.isEditing ? "Khóa lại" : "Chỉnh sửa"}
                                </Button>
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleRemoveItem(index)}
                                />
                            </Space>
                        }
                    >
                        <Form.Item
                            name={["items", index, "bankAccountName"]}
                            label="Họ và tên (tài khoản ngân hàng)"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Vui lòng nhập tên tài khoản ngân hàng",
                                },
                                {
                                    type: "string",
                                    message:
                                        "Tên tài khoản ngân hàng phải là chuỗi",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập họ và tên"
                                disabled={!item.isEditing}
                            />
                        </Form.Item>

                        <Form.Item
                            name={["items", index, "bankAccountNumber"]}
                            label="Số tài khoản (tài khoản ngân hàng)"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Vui lòng nhập số tài khoản ngân hàng",
                                },
                                {
                                    type: "string",
                                    message: "Số tài khoản phải là chuỗi",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập số tài khoản"
                                disabled={!item.isEditing}
                            />
                        </Form.Item>

                        <Form.Item
                            name={["items", index, "bankName"]}
                            label="Tên ngân hàng"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên ngân hàng",
                                },
                                {
                                    type: "string",
                                    message: "Tên ngân hàng phải là chuỗi",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập tên ngân hàng"
                                disabled={!item.isEditing}
                            />
                        </Form.Item>

                        <Form.Item
                            name={["items", index, "phoneNumber"]}
                            label="Số điện thoại (tài khoản ví điện tử: zalopay, mono, v.v.)"
                            rules={[
                                {
                                    type: "string",
                                    message: "Số điện thoại phải là chuỗi",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập số điện thoại"
                                disabled={!item.isEditing}
                            />
                        </Form.Item>

                        <Form.Item
                            name={["items", index, "facebookProfileLink"]}
                            label="Link trang facebook cá nhân"
                            rules={[
                                {
                                    type: "url",
                                    message: "Link Facebook không hợp lệ",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập link Facebook"
                                disabled={!item.isEditing}
                            />
                        </Form.Item>

                        <Form.Item
                            name={["items", index, "complaintLink"]}
                            label="Link bài viết tố cáo"
                            rules={[
                                {
                                    type: "url",
                                    message: "Link tố cáo không hợp lệ",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập link bài viết tố cáo"
                                disabled={!item.isEditing}
                            />
                        </Form.Item>

                        <Form.Item
                            name={["items", index, "proofFiles"]}
                            label="File - Hình ảnh minh chứng"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e.fileList}
                        >
                            <Upload {...uploadProps(index)}>
                                {item.proofFiles &&
                                item.proofFiles.length >= 5 ? null : (
                                    <button
                                        style={{
                                            border: 0,
                                            background: "none",
                                        }}
                                        type="button"
                                    >
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>
                                            Tải lên
                                        </div>
                                    </button>
                                )}
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name={["items", index, "personalComment"]}
                            label="Lời bình luận cá nhân"
                            rules={[
                                {
                                    type: "string",
                                    message: "Bình luận cá nhân phải là chuỗi",
                                },
                            ]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Nhập bình luận cá nhân"
                                disabled={!item.isEditing}
                            />
                        </Form.Item>
                    </Card>
                ))}

                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="dashed"
                        onClick={handleAddItem}
                        block
                        icon={<PlusOutlined />}
                    >
                        Thêm
                    </Button>
                </div>

                <Button type="primary" htmlType="submit" block>
                    Gửi
                </Button>
            </Form>
            {previewImage && (
                <Image
                    width={0}
                    height={0}
                    style={{ display: "none" }}
                    src={previewImage}
                    preview={{
                        visible: previewVisible,
                        onVisibleChange: (visible) =>
                            setPreviewVisible(visible),
                    }}
                />
            )}
        </div>
    );
};

export default PostUi;
