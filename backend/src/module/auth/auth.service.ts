import { Injectable } from '@nestjs/common';
import {
  RegisterUserDataDto,
  ResendVerifyCodeUserDataDto,
  VerifyCodeUserDataDto,
} from 'src/module/auth/dto/create-auth.dto';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
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
}
