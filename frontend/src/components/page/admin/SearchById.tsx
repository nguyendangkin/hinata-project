"use client";

import { Button } from "antd";
import { useState } from "react";
import { usePRouter } from "@/hooks/usePRouter";

const SearchById = () => {
    const [inputId, setInputId] = useState("");
    const router = usePRouter();

    const handleGoToDelete = () => {
        if (!inputId.trim()) return;
        router.push(`/admin-delete-post/${inputId.trim()}`);
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "8px",
                marginBottom: 20,
                alignItems: "center",
            }}
        >
            <input
                placeholder="Nhập ID bài tố cáo"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "1px solid #d9d9d9",
                    width: "240px",
                }}
            />
            <Button
                type="primary"
                disabled={!inputId.trim()}
                onClick={handleGoToDelete}
            >
                Tới trang xóa
            </Button>
        </div>
    );
};

export default SearchById;
