interface IResponseMessage {
    id: number;
    message: string;
}

interface IResendVerifyCodeUser {
    email: string;
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

interface IRequestApiResendVerifyCodeUser extends IResendVerifyCodeUser {}
interface IResponseResendVerifyCodeUser extends IResponseMessage {}

interface IReqSendVerifyCodeUser extends IResendVerifyCodeUser {}
interface IResSendVerifyCodeUser extends IResponseMessage {}

interface IReqLogin {
    email: string;
    password: string;
}
interface IResLogin extends IResponseMessage {}
