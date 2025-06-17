import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDataDto {
  @IsNotEmpty({ message: 'Tên hiển thị không được để trống' })
  @MaxLength(34, {
    message: 'Tên hiển thị không được vượt quá 34 ký tự',
  })
  displayName: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, {
    message: 'Mật khẩu ít nhất phải có 6 ký tự',
  })
  password: string;
}

export class VerifyCodeUserDataDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mã kích hoạt không được để trống' })
  activationCode: string;
}

export class ResendVerifyCodeUserDataDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;
}

export class SendVerifyCodeUserDataDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;
}

export class VerifyCodeChangePasswordUserDataDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mã kích hoạt không được để trống' })
  activationCode: string;
}

export class SendVerifyCodeChangePasswordUserDataDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;
}

export class ChangePasswordUserDto {
  @IsNotEmpty({ message: 'Token không được để trống' })
  resetPasswordToken: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, {
    message: 'Mật khẩu ít nhất phải có 6 ký tự',
  })
  password: string;
}
