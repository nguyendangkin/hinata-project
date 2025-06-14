import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterUserDataDto,
  ResendVerifyCodeUserDataDto,
  SendVerifyCodeUserDataDto,
  VerifyCodeUserDataDto,
} from 'src/module/auth/dto/create-auth.dto';
import { LocalAuthGuard } from 'src/module/auth/passport/local-auth.guard';
import { JwtAuthGuard } from 'src/module/auth/passport/jwt-auth.guard';
import { Public } from 'src/decorator/mainCommon';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  async registerUser(@Body() registerUserData: RegisterUserDataDto) {
    return await this.authService.handleRegisterUser(registerUserData);
  }

  @Public()
  @Post('verify-code')
  async verifyCodeUser(@Body() verifyCodeUserData: VerifyCodeUserDataDto) {
    return await this.authService.handleVerifyCodeUser(verifyCodeUserData);
  }

  @Public()
  @Post('resend-verify-code')
  async resendVerifyCodeUser(
    @Body() resendVerifyCodeUserData: ResendVerifyCodeUserDataDto,
  ) {
    return await this.authService.handleResendVerifyCodeUser(
      resendVerifyCodeUserData,
    );
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('send-verify-code')
  async SendVerifyCodeUserData(
    @Body() sendVerifyCodeUserData: SendVerifyCodeUserDataDto,
  ) {
    return this.authService.handleSendVerifyCodeUser(sendVerifyCodeUserData);
  }
}
