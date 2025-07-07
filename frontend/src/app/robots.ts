import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/admin-delete-post/",
                "/admin-view/",
                "/api/",
                "/ban/",
                "/forgot-password/",
                "/login/",
                "/register/",
                "/post/",
                "/profile/",
            ],
        },
        sitemap: "https://yourdomain.com/sitemap.xml",
    };
}
