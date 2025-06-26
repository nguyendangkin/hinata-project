export default function BanPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
            }}
        >
            <div
                style={{
                    maxWidth: "28rem",
                    width: "100%",
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "2rem",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "4rem",
                        width: "4rem",
                        borderRadius: "9999px",
                        backgroundColor: "#fee2e2",
                        marginBottom: "1rem",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>

                <h1
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "0.5rem",
                    }}
                >
                    Tài khoản bị khóa
                </h1>

                <p
                    style={{
                        color: "#4a5568",
                        marginBottom: "1.5rem",
                    }}
                >
                    Rất tiếc, tài khoản của bạn đã bị khóa do vi phạm điều khoản
                    sử dụng.
                </p>

                <div
                    style={{
                        color: "#718096",
                        fontSize: "0.875rem",
                        borderTop: "1px solid #e2e8f0",
                        paddingTop: "1.5rem",
                    }}
                >
                    <p>Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ</p>
                    <a
                        href="mailto:support@example.com"
                        style={{
                            color: "#3b82f6",
                            textDecoration: "underline",
                        }}
                    >
                        support@example.com
                    </a>
                </div>
            </div>
        </div>
    );
}
