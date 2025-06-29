import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsArray,
  ValidateNested,
  IsInt,
  IsPositive,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsEmail } from 'class-validator';

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

export class GetAPostDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number;
}

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  current?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}

export class ApprovePostDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number;
}

export class BanUserDto {
  @IsEmail()
  email: string;
}

export class DeletePostDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number;
}
