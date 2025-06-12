import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class registerUserDataDto {
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

export class verifyCodeUserDataDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mã kích hoạt không được để trống' })
  activationCode: string;
}
