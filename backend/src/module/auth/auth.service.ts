import { Injectable } from '@nestjs/common';
import { registerUserDataDto } from 'src/module/auth/dto/create-auth.dto';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async handleRegisterUser(registerUserData: registerUserDataDto) {
    return await this.userService.handleRegisterUser(registerUserData);
  }
}
