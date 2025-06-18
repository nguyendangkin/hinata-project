// utils/request.ts
import { auth } from "@/auth";
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
    next?: {
        revalidate?: number | false;
        tags?: string[];
    };
    isFile?: boolean;
    timeout?: number;
    skipAuth?: boolean; // Option to skip auto-token for public endpoints
}

export interface ApiResponse<T = any> {
    data?: T;
    statusCode?: number;
    message?: string;
    error?: string;
    success?: boolean;
}

// Function to get token from session
const getAuthToken = async (): Promise<string | null> => {
    try {
        const session = await auth();
        return session?.user.access_token || null;
    } catch (error) {
        console.warn("Không lấy được token:", error);
        return null;
    }
};

const sendRequest = async <T>(props: IRequest): Promise<ApiResponse<T>> => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
        cache = "no-store",
        next,
        isFile = false,
        timeout = 30000,
        skipAuth = false, // Don't auto-add token for public endpoints
    } = props;

    try {
        if (!url) {
            throw new Error("URL is required");
        }

        // Auto-add Authorization token if not skipped
        if (!skipAuth) {
            const token = await getAuthToken();
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }

        // Create headers
        const computedHeaders = isFile
            ? headers
            : {
                  "Content-Type": "application/json",
                  ...headers,
              };

        // Add query string if exists
        if (Object.keys(queryParams).length > 0) {
            const separator = url.includes("?") ? "&" : "?";
            url += `${separator}${queryString.stringify(queryParams)}`;
        }

        // Prepare request body
        let requestBody: string | FormData | null = null;
        if (body) {
            requestBody = isFile ? (body as FormData) : JSON.stringify(body);
        }

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Merge options - Next.js 15 compatible
        const options: RequestInit = {
            method,
            headers: new Headers(computedHeaders),
            body: requestBody,
            signal: controller.signal,
            cache,
            ...nextOption,
        };

        // Add next options if available (Next.js 15 still supports)
        if (next) {
            (options as any).next = next;
        }

        if (useCredentials) {
            options.credentials = "include";
        }

        // Send request
        const res = await fetch(url, options);

        // Clear timeout
        clearTimeout(timeoutId);

        // Handle response
        let json: any;
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            json = await res.json();
        } else {
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

// Request object with methods
export const request = {
    send: sendRequest,

    get: <T>(
        url: string,
        options?: Omit<IRequest, "url" | "method">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "GET", ...options });
    },

    post: <T>(
        url: string,
        body?: any,
        options?: Omit<IRequest, "url" | "method" | "body">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "POST", body, ...options });
    },

    put: <T>(
        url: string,
        body?: any,
        options?: Omit<IRequest, "url" | "method" | "body">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "PUT", body, ...options });
    },

    patch: <T>(
        url: string,
        body?: any,
        options?: Omit<IRequest, "url" | "method" | "body">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "PATCH", body, ...options });
    },

    delete: <T>(
        url: string,
        options?: Omit<IRequest, "url" | "method">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "DELETE", ...options });
    },

    del: <T>(
        url: string,
        options?: Omit<IRequest, "url" | "method">
    ): Promise<ApiResponse<T>> => {
        return sendRequest<T>({ url, method: "DELETE", ...options });
    },
};

export default request;

// Example usage:
/*
// Auto-add token for all requests
const users = await request.get<User[]>("/api/users");

// Skip token for public endpoints  
const publicData = await request.get<PublicData>("/api/public", {
    skipAuth: true
});

// Server-side usage - token automatically from session
async function ServerComponent() {
    const data = await request.get<Data>("/api/protected-data");
    return <div>{data.data?.title}</div>;
}

// API route usage
export async function GET() {
    const result = await request.get<ExternalData>("https://external-api.com/data");
    return Response.json(result.data);
}

// Manual token override (if needed)
const specialRequest = await request.get<Data>("/api/special", {
    headers: {
        'Authorization': 'Bearer different-token'
    }
});
*/
