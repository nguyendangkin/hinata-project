import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { registerUserDataDto } from 'src/module/auth/dto/create-auth.dto';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  generateActivationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async emailService(user: User, activationCode: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Mã xác nhận của bạn',
      template: 'verification-code',
      context: {
        displayName: user.displayName,
        activationCode: activationCode,
      },
    });
  }

  async handleRegisterUser(registerUserData: registerUserDataDto) {
    try {
      // kiểm tra email có hoặc không tồn tại hay chưa?
      const email = registerUserData.email;
      const emailExists = await this.userRepository.exists({
        where: { email },
      });
      if (emailExists) {
        throw new BadRequestException('Email đã được đăng ký');
      }
      // mã hóa mật khẩu
      const hashPassword = await this.hashPassword(registerUserData.password);

      // tạo code 6 chữ số
      const activationCode = this.generateActivationCode();
      // create và save vào database
      const user = this.userRepository.create({
        displayName: registerUserData.displayName,
        email: registerUserData.email,
        password: hashPassword,
        isActive: false,
        activationCode: activationCode,
        codeExpired: dayjs().add(5, 'minutes').toDate(),
      });
      const resultUser = await this.userRepository.save(user);

      // gửi email
      await this.emailService(resultUser, activationCode);

      return {
        id: resultUser.id,
      };
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }
}
