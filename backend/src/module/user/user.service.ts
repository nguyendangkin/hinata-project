import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  RegisterUserDataDto,
  ResendVerifyCodeUserDataDto,
  SendVerifyCodeUserDataDto,
  VerifyCodeUserDataDto,
} from 'src/module/auth/dto/create-auth.dto';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import {
  generateActivationCode,
  hashPasswordUtil,
} from '../../utils/mainUtils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

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
        throw new BadRequestException('Email tài khoản đã được đăng ký');
      }
      // mã hóa mật khẩu
      const hashPassword = await hashPasswordUtil(registerUserData.password);

      // tạo code 6 chữ số
      const activationCode = generateActivationCode();

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
        throw new BadRequestException(
          'Email tài khoản người dùng không tồn tại',
        );
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
      const activationCode = generateActivationCode();

      // update and save
      user.activationCode = activationCode;
      user.codeExpired = dayjs().add(5, 'minutes').toDate();
      const resultUser = await this.userRepository.save(user);

      // gửi email
      await this.sendMailService(resultUser, activationCode);

      return {
        id: resultUser.id,
        message: 'Gửi lại mã thành công, vui lòng kiểm tra Email',
      };
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }

  // tìm user cho local passport xử lý
  async findOne(email: string) {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  async handleSendVerifyCodeUser(
    sendVerifyCodeUserData: SendVerifyCodeUserDataDto,
  ) {
    try {
      // tìm lấy người dùng qua email
      const email = sendVerifyCodeUserData.email;
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
      const activationCode = generateActivationCode();

      // update and save
      user.activationCode = activationCode;
      user.codeExpired = dayjs().add(5, 'minutes').toDate();
      const resultUser = await this.userRepository.save(user);

      // gửi email
      await this.sendMailService(resultUser, activationCode);

      return {
        id: resultUser.id,
        message: 'Vui lòng kiểm tra email để nhận mã',
      };
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }
}
