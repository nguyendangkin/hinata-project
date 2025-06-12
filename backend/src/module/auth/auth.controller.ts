import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterUserDataDto,
  ResendVerifyCodeUserDataDto,
  VerifyCodeUserDataDto,
} from 'src/module/auth/dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async registerUser(@Body() registerUserData: RegisterUserDataDto) {
    return await this.authService.handleRegisterUser(registerUserData);
  }

  @Post('verify-code')
  async verifyCodeUser(@Body() verifyCodeUserData: VerifyCodeUserDataDto) {
    return await this.authService.handleVerifyCodeUser(verifyCodeUserData);
  }

  @Post('resend-verify-code')
  async resendVerifyCodeUser(
    @Body() resendVerifyCodeUserData: ResendVerifyCodeUserDataDto,
  ) {
    return await this.authService.handleResendVerifyCodeUser(
      resendVerifyCodeUserData,
    );
  }
}
