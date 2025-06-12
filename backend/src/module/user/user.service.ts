import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  RegisterUserDataDto,
  ResendVerifyCodeUserDataDto,
  VerifyCodeUserDataDto,
} from 'src/module/auth/dto/create-auth.dto';
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

  async sendMailService(user: User, activationCode: string) {
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

  async handleRegisterUser(registerUserData: RegisterUserDataDto) {
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
      await this.sendMailService(resultUser, activationCode);

      return {
        id: resultUser.id,
        message: 'Đăng ký tài khoản thành công',
      };
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }

  async handleVerifyCodeUser(verifyCodeUserData: VerifyCodeUserDataDto) {
    try {
      // tìm user bởi email
      const email = verifyCodeUserData.email;
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException('Email người dùng không tồn tại');
      }

      // check đã kích hoạt chưa?
      if (user.isActive) {
        throw new BadRequestException('Tài khoản người dùng đã được kích hoạt');
      }

      // check hết hạn code
      const isCodeExpired = dayjs().isAfter(user.codeExpired);
      if (isCodeExpired) {
        throw new BadRequestException('Mã kích hoạt đã hết hạn');
      }

      // check mã code
      if (user.activationCode !== verifyCodeUserData.activationCode) {
        throw new BadRequestException('Mã kích hoạt không chính xác');
      }

      // update và save
      user.isActive = true;
      user.activationCode = null;
      user.codeExpired = null;
      const resultUser = await this.userRepository.save(user);

      return {
        id: resultUser.id,
        message: 'Kích hoạt tài khoản thành công',
      };
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }

  async handleResendVerifyCodeUser(
    resendVerifyCodeUserData: ResendVerifyCodeUserDataDto,
  ) {
    try {
      // tìm user bởi email
      const email = resendVerifyCodeUserData.email;
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(
          'Email tài khoản người dùng không tồn tại',
        );
      }

      // check đã kích hoạt?
      if (user.isActive) {
        throw new BadRequestException('Tài khoản người dùng đã được kích hoạt');
      }

      // tạo code 6 chữ số
      const activationCode = this.generateActivationCode();

      // update and save
      user.activationCode = activationCode;
      user.codeExpired = dayjs().add(5, 'minutes').toDate();
      const resultUser = await this.userRepository.save(user);

      // gửi email
      await this.sendMailService(resultUser, activationCode);

      return {
        id: resultUser.id,
        message: 'Đã gửi lại mã xác nhận thành công',
      };
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }
}
