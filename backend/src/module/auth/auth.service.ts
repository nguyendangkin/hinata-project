import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordUserDto,
  RegisterUserDataDto,
  ResendVerifyCodeUserDataDto,
  SendVerifyCodeChangePasswordUserDataDto,
  SendVerifyCodeUserDataDto,
  VerifyCodeChangePasswordUserDataDto,
  VerifyCodeUserDataDto,
} from 'src/module/auth/dto/create-auth.dto';
import { UserService } from 'src/module/user/user.service';
import { comparePasswordUtil } from 'src/utils/mainUtils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async handleRegisterUser(registerUserData: RegisterUserDataDto) {
    return await this.userService.handleRegisterUser(registerUserData);
  }

  async handleVerifyCodeUser(verifyCodeUserData: VerifyCodeUserDataDto) {
    return await this.userService.handleVerifyCodeUser(verifyCodeUserData);
  }

  async handleResendVerifyCodeUser(
    resendVerifyCodeUserData: ResendVerifyCodeUserDataDto,
  ) {
    return await this.userService.handleResendVerifyCodeUser(
      resendVerifyCodeUserData,
    );
  }

  // valid gọi xuống service user, rồi so sánh mật khẩu người dùng
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await comparePasswordUtil(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  // với jwt từ passport, trả về token
  async login(user: any) {
    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };
    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        username: user.username,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
      message: 'Đăng nhập thành công',
    };
  }

  async handleSendVerifyCodeUser(
    sendVerifyCodeUserData: SendVerifyCodeUserDataDto,
  ) {
    return this.userService.handleSendVerifyCodeUser(sendVerifyCodeUserData);
  }

  async handleSendVerifyCodeChangePasswordUser(
    sendVerifyCodeChangePasswordUserData: SendVerifyCodeChangePasswordUserDataDto,
  ) {
    return await this.userService.handleSendVerifyCodeChangePasswordUser(
      sendVerifyCodeChangePasswordUserData,
    );
  }

  async handleVerifyCodeChangePasswordUser(
    verifyCodeChangePasswordUserData: VerifyCodeChangePasswordUserDataDto,
  ) {
    return await this.userService.handleVerifyCodeChangePasswordUser(
      verifyCodeChangePasswordUserData,
    );
  }

  async handleChangePasswordUser(data: ChangePasswordUserDto) {
    return await this.userService.handleChangePasswordUser(data);
  }
}
