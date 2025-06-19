import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePostDto } from 'src/module/post/dto/create-post.dto';

export class CreateManyPostDto {
  @IsArray({ message: 'Danh sách phải là một mảng.' })
  @ArrayMinSize(1, { message: 'Phải có ít nhất một mục.' })
  @ValidateNested({ each: true })
  @Type(() => CreatePostDto)
  posts: CreatePostDto[];
}
