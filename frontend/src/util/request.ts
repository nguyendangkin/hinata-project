// utils/request.ts
import queryString from "query-string";

export interface IRequest {
    url: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: { [key: string]: any } | FormData;
    queryParams?: Record<string, any>;
    useCredentials?: boolean;
    headers?: Record<string, string>;
    nextOption?: RequestInit;
    cache?: RequestCache;
    // Compatible với Next.js 14
    next?: {
        revalidate?: number | false;
        tags?: string[];
    };
    isFile?: boolean;
    timeout?: number; // timeout in milliseconds
}

export interface ApiResponse<T = any> {
    data?: T;
    statusCode?: number;
    message?: string;
    error?: string;
    success?: boolean;
}

const sendRequest = async <T>(props: IRequest): Promise<ApiResponse<T>> => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
        cache = "no-store", // Default cache cho Next.js 14
        next,
        isFile = false,
        timeout = 30000, // 30 seconds default
    } = props;

    try {
        // Validate URL
        if (!url) {
            throw new Error("URL is required");
        }

        // Tạo headers
        const computedHeaders = isFile
            ? headers // Browser sẽ tự set content-type cho FormData
            : {
                  "Content-Type": "application/json",
                  ...headers,
              };

        // Thêm query string nếu có
        if (Object.keys(queryParams).length > 0) {
            const separator = url.includes("?") ? "&" : "?";
            url += `${separator}${queryString.stringify(queryParams)}`;
        }

        // Prepare request body
        let requestBody: string | FormData | null = null;
        if (body) {
            requestBody = isFile ? (body as FormData) : JSON.stringify(body);
        }

        // Tạo AbortController cho timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Gộp options - Next.js 14 compatible
        const options: RequestInit = {
            method,
            headers: new Headers(computedHeaders),
            body: requestBody,
            signal: controller.signal,
            cache,
            ...nextOption,
        };

        // Thêm next options nếu có (Next.js 14 specific)
        if (next) {
            (options as any).next = next;
        }

        if (useCredentials) {
            options.credentials = "include";
        }

        // Gửi request
        const res = await fetch(url, options);

        // Clear timeout
        clearTimeout(timeoutId);

        // Xử lý response
        let json: any;
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            json = await res.json();
        } else {
            // Nếu không phải JSON, trả về text
            const text = await res.text();
            json = { data: text };
        }

        if (res.ok) {
            return {
                data: json,
                statusCode: res.status,
                success: true,
            };
        } else {
            return {
                statusCode: res.status,
                message: json?.message ?? `HTTP Error: ${res.status}`,
                error: json?.error ?? res.statusText,
                success: false,
            };
        }
    } catch (error: any) {
        // Xử lý các loại error khác nhau
        if (error.name === "AbortError") {
            return {
                statusCode: 408,
                message: "Request timeout",
                error: "Request was aborted due to timeout",
                success: false,
            };
        }

        if (error instanceof TypeError && error.message.includes("fetch")) {
            return {
                statusCode: 0,
                message: "Network error",
                error: "Unable to connect to server",
                success: false,
            };
        }

        return {
            statusCode: 500,
            message: error.message || "Unknown error occurred",
            error: error.toString(),
            success: false,
        };
    }
};

// Request object với các methods
export const request = {
    // Core method - có thể dùng trực tiếp nếu cần
    send: sendRequest,

    // GET method
    get: <T>(
        url: string,
        options?: Omit<IRequest, "url" | "method">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "GET", ...options });
    },

    // POST method
    post: <T>(
        url: string,
        body?: any,
        options?: Omit<IRequest, "url" | "method" | "body">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "POST", body, ...options });
    },

    // PUT method
    put: <T>(
        url: string,
        body?: any,
        options?: Omit<IRequest, "url" | "method" | "body">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "PUT", body, ...options });
    },

    // PATCH method
    patch: <T>(
        url: string,
        body?: any,
        options?: Omit<IRequest, "url" | "method" | "body">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "PATCH", body, ...options });
    },

    // DELETE method
    delete: <T>(
        url: string,
        options?: Omit<IRequest, "url" | "method">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "DELETE", ...options });
    },

    // Alias cho delete (vì delete là reserved keyword)
    del: <T>(
        url: string,
        options?: Omit<IRequest, "url" | "method">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "DELETE", ...options });
    },
};

// Export default để có thể dùng như: import request from './request'
export default request;

// Example usage cho Next.js 14:
/*
import request from "@/utils/request";

// Client-side usage
const users = await request.get<User[]>("/api/users");

// Server-side với caching (App Router)
const data = await request.get<Data>("/api/data", {
    cache: "force-cache",
    next: { revalidate: 3600 } // Revalidate every hour
});

// Server-side với tags (cho revalidation)
const posts = await request.get<Post[]>("/api/posts", {
    next: { tags: ["posts"] }
});

// File upload
const formData = new FormData();
formData.append("file", file);
const uploadResult = await request.post<UploadResponse>("/api/upload", formData, {
    isFile: true
});

// Với query params
const searchResults = await request.get<SearchResult[]>("/api/search", {
    queryParams: { 
        q: "nextjs", 
        page: 1, 
        limit: 10 
    }
});
*/
