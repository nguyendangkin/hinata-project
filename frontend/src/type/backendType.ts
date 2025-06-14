interface IResponseMessage {
    id: number;
    message: string;
}

interface IRequestApiRegisterUser {
    displayName: string;
    email: string;
    password: string;
}

interface IResponseApiRegisterUser extends IResponseMessage {}

interface IRequestApiVerifyCodeUser {
    email: string;
    activationCode: string;
}

interface IResponseVerifyCodeUser extends IResponseMessage {}

interface IRequestApiResendVerifyCodeUser {
    email: string;
}

interface IResponsiveResendVerifyCodeUser extends IResponseMessage {}
