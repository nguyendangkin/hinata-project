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
interface IResLogin {
    user: {
        id: number;
        email: string;
        displayName: string;
        username: string | null;
        role: string;
    };
    access_token: string;
    message: string;
}

interface IReqGetVerifyCodeChangePassword {
    email: string;
}
interface IResGetVerifyCodeChangePassword extends IResponseMessage {}

interface IReqVerifyCodeChangePassword {
    email: string;
    activationCode: string;
}
interface IResVerifyCodeChangePassword {
    id: number;
    resetPasswordToken: string;
    message: string;
}

interface IReqChangePassword {
    id: number;
    resetPasswordToken: string;
    message: string;
}
interface IResChangePassword extends IResponseMessage {}

interface IReqGetProfileUser {}
interface IResGetProfileUser extends IResponseMessage {}

interface IResCreatePost {
    message: string;
}

interface IResGetAllPost {
    results: [];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
}

interface IResApprovePost {
    id: string;
    message: string;
}

interface IResRejectPost extends IResponseMessage {}
interface IResBanUser extends IResponseMessage {}

interface IResGetAdminAnalytics {
    users: {
        total: number;
        newThisMonth: number;
        growthRatePercent: number;
        banned: number;
    };
    posts: {
        total: number;
        approved: number;
        rejected: number;
        growthRatePercent: number;
        monthlyBreakdown: [];
    };
}

interface IResDeletePost extends IResponseMessage {}
