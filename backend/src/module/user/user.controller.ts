import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/decorator/mainCommon';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Public()
  // @Post('link')
  // async getUidFacebookLink(@Body('link') link: string) {
  //   return await this.userService.getUidFacebookLink(link);
  // }

  // @Get('profile')
  // async getProfileUser() {
  //   return {
  //     id: 1,
  //     message: 'Xin chào',
  //   };
  // }

  @Get('admin-analytics')
  @Roles('admin')
  async getAdminAnalytics() {
    return this.userService.getAdminAnalytics();
  }
}
