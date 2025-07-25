import { BadRequestException, Injectable } from '@nestjs/common';
import { Between, MoreThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChangePasswordUserDto,
  RegisterUserDataDto,
  ResendVerifyCodeUserDataDto,
  SendVerifyCodeChangePasswordUserDataDto,
  SendVerifyCodeUserDataDto,
  VerifyCodeChangePasswordUserDataDto,
  VerifyCodeUserDataDto,
} from 'src/module/auth/dto/create-auth.dto';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import {
  generateActivationCode,
  hashPasswordUtil,
} from '../../utils/mainUtils';
import { firstValueFrom } from 'rxjs';
import * as qs from 'qs';
import { error } from 'console';
import { ConfigService } from '@nestjs/config';
import { Post } from 'src/module/post/entities/post.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createAdminIfNotExists() {
    try {
      const email = this.configService.get<string>('ADMIN_EMAIL');
      const password = this.configService.get<string>('ADMIN_PASSWORD');
      const displayName =
        this.configService.get<string>('ADMIN_DISPLAY_NAME') || 'Admin';

      if (!email || !password) {
        console.warn('Thiếu ADMIN_EMAIL hoặc ADMIN_PASSWORD trong .env');
        return;
      }

      const existingAdmin = await this.userRepository.findOne({
        where: { email, isActive: true },
      });

      if (existingAdmin) {
        console.log('Admin đã tồn tại, bỏ qua tạo mới');
        return;
      }

      const hashedPassword = await hashPasswordUtil(password);

      const admin = this.userRepository.create({
        email,
        displayName,
        password: hashedPassword,
        isActive: true,
        role: 'admin',
      });

      await this.userRepository.save(admin);
      console.log('Tài khoản admin đầu tiên đã được tạo');
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản admin:', error);
      throw new error();
    }
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
        message: 'Đăng ký bước đầu thành công, chờ kích hoạt',
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

  async getUidFacebookLink(
    link: string,
  ): Promise<{ uid: string; message: string }> {
    try {
      const encodedUrl = encodeURIComponent(link);

      const res = await firstValueFrom(
        this.httpService.get(
          `https://ffb.vn/api/tool/get-id-fb?idfb=${encodedUrl}`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0',
              Accept: 'application/json, text/javascript, */*; q=0.01',
              'X-Requested-With': 'XMLHttpRequest',
              Referer: 'https://ffb.vn/get-uid',
            },
            responseType: 'text',
          },
        ),
      );

      const data = JSON.parse(res.data);
      return {
        uid: data.id,
        message: data.msg || 'Thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async handleSendVerifyCodeChangePasswordUser(
    sendVerifyCodeChangePasswordUserData: SendVerifyCodeChangePasswordUserDataDto,
  ) {
    try {
      // tìm lấy người dùng qua email
      const email = sendVerifyCodeChangePasswordUserData.email;
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(
          'Email tài khoản người dùng không tồn tại',
        );
      }

      // check đã kích hoạt?
      if (user.isActive === false) {
        throw new BadRequestException(
          'Tài khoản người dùng chưa được kích hoạt',
        );
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

  async handleVerifyCodeChangePasswordUser(
    verifyCodeChangePasswordUserData: VerifyCodeChangePasswordUserDataDto,
  ) {
    try {
      // tìm user bởi email
      const email = verifyCodeChangePasswordUserData.email;
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(
          'Email tài khoản người dùng không tồn tại',
        );
      }

      // check đã kích hoạt chưa?
      if (user.isActive === false) {
        throw new BadRequestException(
          'Tài khoản người dùng chưa được kích hoạt',
        );
      }

      // check hết hạn code
      const isCodeExpired = dayjs().isAfter(user.codeExpired);
      if (isCodeExpired) {
        throw new BadRequestException('Mã kích hoạt đã hết hạn');
      }

      // check mã code
      if (
        user.activationCode !== verifyCodeChangePasswordUserData.activationCode
      ) {
        throw new BadRequestException('Mã kích hoạt không chính xác');
      }

      // update và save
      user.activationCode = null;
      user.resetPasswordToken = uuidv4();
      const resultUser = await this.userRepository.save(user);

      return {
        id: resultUser.id,
        resetPasswordToken: resultUser.resetPasswordToken,
        message: 'Xác thực thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async handleChangePasswordUser(data: ChangePasswordUserDto) {
    try {
      // tìm user bởi email
      const email = data.email;
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(
          'Email tài khoản người dùng không tồn tại',
        );
      }

      // check đã kích hoạt chưa? Chưa thì sao đổi được mật khẩu
      if (user.isActive === false) {
        throw new BadRequestException(
          'Tài khoản người dùng chưa được kích hoạt',
        );
      }

      // check hết hạn code // cho phép thời gian đổi mật khẩu tổng hết là 5 phút, kể từ bước gửi mã
      const isCodeExpired = dayjs().isAfter(user.codeExpired);
      if (isCodeExpired) {
        throw new BadRequestException('Mã kích hoạt đã hết hạn');
      }

      // check mã token
      if (user.resetPasswordToken !== data.resetPasswordToken) {
        throw new BadRequestException('Mã kích hoạt không chính xác');
      }

      // update và save
      const hashPassword = await hashPasswordUtil(data.password);

      user.resetPasswordToken = null;
      user.codeExpired = null;
      user.password = hashPassword;
      const resultUser = await this.userRepository.save(user);

      return {
        id: resultUser.id,
        message: 'Đổi mật khẩu thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async handleBanUser(email: string) {
    try {
      // Find user by email
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['posts'],
      });

      if (!user) {
        throw new BadRequestException(
          'Email tài khoản người dùng không tồn tại',
        );
      }

      // kiểm tra xem người dùng đã bị ban chưa
      if (user.role === 'ban') {
        throw new BadRequestException(
          'Tài khoản người dùng đã bị ban trước đó',
        );
      }

      // kiểm tra xem người dùng có phải là admin không
      if (user.role === 'admin') {
        throw new BadRequestException('Không thể ban tài khoản admin');
      }

      // Lặp qua các bài viết để xóa ảnh
      for (const post of user.posts) {
        if (post.imagePaths && post.imagePaths.length > 0) {
          for (const imagePath of post.imagePaths) {
            const fullPath = path.join(process.cwd(), imagePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          }
        }
      }

      // xóa toàn bộ bài viết của người dùng này
      await this.postRepository.delete({ user: { id: user.id } });

      // Update and save
      user.role = 'ban';
      const resultUser = await this.userRepository.save(user);

      return {
        id: resultUser.id,
        message: 'Ban tài khoản thành công và đã xoá bài viết kèm ảnh',
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdminAnalytics() {
    try {
      const now = dayjs();
      const startOfThisMonth = now.startOf('month').toDate();
      const startOfLastMonth = now
        .subtract(1, 'month')
        .startOf('month')
        .toDate();
      const endOfLastMonth = now.startOf('month').toDate();

      // ----------- USER ------------
      const totalUsers = await this.userRepository.count();

      const newUsersThisMonth = await this.userRepository.count({
        where: {
          createdAt: MoreThanOrEqual(startOfThisMonth),
        },
      });

      const newUsersLastMonth = await this.userRepository.count({
        where: {
          createdAt: Between(startOfLastMonth, endOfLastMonth),
        },
      });

      const growthRateUsers =
        newUsersLastMonth === 0
          ? 100
          : ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100;

      const bannedUsers = await this.userRepository.count({
        where: { role: 'ban' },
      });

      // ----------- POST ------------
      const totalPosts = await this.postRepository.count();
      const approvedPosts = await this.postRepository.count({
        where: { status: 'approved' },
      });
      const rejectedPosts = await this.postRepository.count({
        where: { status: 'rejected' },
      });

      const postsThisMonth = await this.postRepository.count({
        where: {
          createdAt: MoreThanOrEqual(startOfThisMonth),
        },
      });

      const postsLastMonth = await this.postRepository.count({
        where: {
          createdAt: Between(startOfLastMonth, endOfLastMonth),
        },
      });

      const growthRatePosts =
        postsLastMonth === 0
          ? 100
          : ((postsThisMonth - postsLastMonth) / postsLastMonth) * 100;

      // Số bài viết theo tháng (ví dụ: 6 tháng gần nhất)
      const recentPostStats: { month: string; count: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = now.subtract(i, 'month').startOf('month').toDate();
        const monthEnd = now.subtract(i, 'month').endOf('month').toDate();

        const count = await this.postRepository.count({
          where: {
            createdAt: Between(monthStart, monthEnd),
          },
        });

        recentPostStats.push({
          month: dayjs(monthStart).format('YYYY-MM'),
          count,
        });
      }

      return {
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
          growthRatePercent: Math.round(growthRateUsers),
          banned: bannedUsers,
        },
        posts: {
          total: totalPosts,
          approved: approvedPosts,
          rejected: rejectedPosts,
          growthRatePercent: Math.round(growthRatePosts),
          monthlyBreakdown: recentPostStats,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
