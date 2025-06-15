/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
    static type: string;

    constructor(message?: any) {
        super();

        this.type = message;
    }
}

export class InvalidEmailPasswordError extends AuthError {
    static type = "Email hoặc mật khẩu không chính xác";
}

export class InactiveAccountError extends AuthError {
    static type = "Email tài khoản chưa được kích hoạt";
}
