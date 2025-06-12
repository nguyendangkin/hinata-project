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
import { registerUserDataDto } from 'src/module/auth/dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async registerUser(@Body() registerUserData: registerUserDataDto) {
    return await this.authService.handleRegisterUser(registerUserData);
  }
}
