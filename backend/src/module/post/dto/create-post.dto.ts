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
  @IsNotEmpty()
  bankAccountName: string;

  @IsString()
  @IsNotEmpty()
  bankAccountNumber: string;

  @IsString()
  @IsNotEmpty()
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
