import { Injectable } from '@nestjs/common';
import {
  registerUserDataDto,
  verifyCodeUserDataDto,
} from 'src/module/auth/dto/create-auth.dto';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async handleRegisterUser(registerUserData: registerUserDataDto) {
    return await this.userService.handleRegisterUser(registerUserData);
  }

  async handleVerifyCodeUser(verifyCodeUserData: verifyCodeUserDataDto) {
    return await this.userService.handleVerifyCodeUser(verifyCodeUserData);
  }
}
