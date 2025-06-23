import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập Họ và Tên tài khoản ngân hàng' })
  bankAccountName: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập số tài khoản ngân hàng' })
  bankAccountNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập tên ngân hàng' })
  bankName: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  facebookProfileLink?: string;

  @IsOptional()
  @IsString()
  complaintLink?: string;

  @IsOptional()
  @IsString()
  personalComment?: string;
}

export class CreatePostDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostItemDto)
  items: CreatePostItemDto[];
}
