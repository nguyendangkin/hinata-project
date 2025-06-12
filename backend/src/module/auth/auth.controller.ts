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
  registerUserDataDto,
  verifyCodeUserDataDto,
} from 'src/module/auth/dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async registerUser(@Body() registerUserData: registerUserDataDto) {
    return await this.authService.handleRegisterUser(registerUserData);
  }

  @Post('verify-code')
  async verifyCodeUser(@Body() verifyCodeUserData: verifyCodeUserDataDto) {
    return await this.authService.handleVerifyCodeUser(verifyCodeUserData);
  }
}
