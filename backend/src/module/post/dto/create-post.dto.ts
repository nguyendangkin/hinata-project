import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Tên tài khoản ngân hàng phải là chuỗi.' })
  @IsNotEmpty({ message: 'Vui lòng nhập tên tài khoản ngân hàng.' })
  bankAccountName: string;

  @IsString({ message: 'Số tài khoản phải là chuỗi.' })
  @IsNotEmpty({ message: 'Vui lòng nhập số tài khoản ngân hàng.' })
  bankAccountNumber: string;

  @IsString({ message: 'Tên ngân hàng phải là chuỗi.' })
  @IsNotEmpty({ message: 'Vui lòng nhập tên ngân hàng.' })
  bankName: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi.' })
  phoneNumber?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Link Facebook không hợp lệ.' })
  facebookProfileLink?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Link tố cáo không hợp lệ.' })
  complaintLink?: string;

  @IsOptional()
  @IsString({ message: 'Bình luận cá nhân phải là chuỗi.' })
  personalComment?: string;
}
