import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProofFileDto {
  @IsString()
  uid: string;

  @IsString()
  name: string;

  @IsString()
  status: string;

  @IsString()
  url: string;
}

export class CreatePostItemDto {
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProofFileDto)
  proofFiles: ProofFileDto[];
}

// 3. DTO cho mảng items
export class CreatePostDto {
  @IsArray({ message: 'Items phải là một mảng.' })
  @ValidateNested({ each: true })
  @Type(() => CreatePostItemDto)
  items: CreatePostItemDto[];
}
