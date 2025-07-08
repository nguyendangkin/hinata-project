import "@ant-design/v5-patch-for-react-19";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdProvider from "@/providers/AntdProvider";
import HeaderLayout from "@/components/layout/header/HeaderLayout";
import FooterLayout from "@/components/layout/footer/FooterLayout";
import ContentLayout from "@/components/layout/content/ContentLayout";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "camCheckScam - Tra cứu & Báo cáo Lừa Đảo",
    url: "https://camcheckscam.vn",
    description:
        "Nền tảng giúp xác minh và tố cáo các hành vi lừa đảo liên quan đến tài khoản ngân hàng, số điện thoại và giao dịch trực tuyến.",
    publisher: {
        "@type": "Organization",
        name: "camCheckScam",
        logo: {
            "@type": "ImageObject",
            url: "https://camcheckscam.vn/logo.png",
        },
    },
    potentialAction: {
        "@type": "SearchAction",
        target: "https://camcheckscam.vn/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
    },
};

export const metadata: Metadata = {
    title: "camCheckScam - Tra cứu & Báo cáo Lừa Đảo",
    description:
        "Nền tảng giúp xác minh và tố cáo các hành vi lừa đảo liên quan đến tài khoản ngân hàng, số điện thoại và giao dịch trực tuyến.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <AntdRegistry>
                    <AntdProvider>
                        <HeaderLayout />
                        <ContentLayout>{children}</ContentLayout>
                        <FooterLayout />
                    </AntdProvider>
                    <NextTopLoader />
                </AntdRegistry>
                <Script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
            </body>
        </html>
    );
}
