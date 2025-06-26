import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { User } from 'src/module/user/entities/user.entity';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly userService: UserService,
  ) {}

  async handleCreatePost(
    data: CreatePostDto,
    files: Express.Multer.File[],
    user: User,
  ) {
    // Lặp qua từng item trong data để xử lý từng bài post
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      // Lọc ra các file ảnh tương ứng với từng item
      const imageFiles = files.filter(
        (f) => f.fieldname === `items[${i}][proofFiles][]`,
      );

      // khai báo mảng để lưu đường dẫn ảnh
      const imagePaths: string[] = [];
      for (const file of imageFiles) {
        // Lấy phần mở rộng file
        const ext = path.extname(file.originalname);
        // Tạo tên file ngẫu nhiên
        const fileName = `${uuidv4()}${ext}`;
        // Đảm bảo thư mục uploads tồn tại
        const uploadDir = path.join(process.cwd(), 'uploads');
        fs.mkdirSync(uploadDir, { recursive: true });

        // Đường dẫn lưu file
        const uploadPath = path.join(uploadDir, fileName);
        // Ghi file vào thư mục uploads
        fs.writeFileSync(uploadPath, file.buffer);

        // Lưu đường dẫn file để lưu vào DB
        imagePaths.push(`/uploads/${fileName}`);
      }

      // Tạo entity post mới từ dữ liệu và đường dẫn ảnh
      const post = this.postRepository.create({
        bankAccountName: item.bankAccountName,
        bankAccountNumber: item.bankAccountNumber,
        bankName: item.bankName,
        phoneNumber: item.phoneNumber,
        facebookProfileLink: item.facebookProfileLink,
        complaintLink: item.complaintLink,
        imagePaths,
        personalComment: item.personalComment,
        status: 'pending',
        user,
      });

      // Lưu post vào database
      const saved = await this.postRepository.save(post);
    }

    return {
      message: `Các bài đã được gửi đi thành công`,
    };
  }

  async getAllPosts(current: number = 1, pageSize: number = 10) {
    try {
      // 	Bỏ qua n bản ghi đầu tiên (giống OFFSET)
      const skip = (current - 1) * pageSize;

      const [posts, total] = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .where('post.status = :status', { status: 'pending' })
        .orderBy('post.createdAt', 'ASC')
        .skip(skip)
        .take(pageSize) //	Lấy tối đa m bản ghi sau khi đã skip (giống LIMIT)
        .getManyAndCount();

      // Transform data để match với client
      const results = posts.map((post) => ({
        key: post.id.toString(),
        id: post.id,
        email: post.user?.email || '',
        displayName: post.user?.displayName || '',
        bankAccountName: post.bankAccountName,
        phoneNumber: post.phoneNumber,
        bankAccount: post.bankAccountNumber,
        bankName: post.bankName,
        facebookLink: post.facebookProfileLink,
        reportLink: post.complaintLink,
        proofImages: post.imagePaths || [],
        comment: post.personalComment,
        status: post.status,
      }));

      return {
        results,
        meta: {
          current,
          pageSize,
          pages: Math.ceil(total / pageSize),
          total,
        },
      };
    } catch (error) {
      throw new error();
    }
  }

  async handleApprovePost(id: string) {
    try {
      // Kiểm tra xem post có tồn tại không
      const post = await this.postRepository.findOne({
        where: { id: parseInt(id) },
      });

      if (!post) {
        throw new BadRequestException(`Không tìm thấy bài post với ID: ${id}`);
      }

      // Kiểm tra trạng thái hiện tại
      if (post.status !== 'pending') {
        throw new BadRequestException(
          `Bài post này đã được xử lý với trạng thái: ${post.status}`,
        );
      }

      // Cập nhật trạng thái thành approved
      await this.postRepository.update(
        { id: parseInt(id) },
        {
          status: 'approved',
        },
      );

      return {
        id: id,
        message: `Bài post với ID ${id} đã được phê duyệt thành công.`,
      };
    } catch (error) {
      throw error;
    }
  }

  async handleRejectPost(id: string) {
    try {
      // Kiểm tra xem post có tồn tại không
      const post = await this.postRepository.findOne({
        where: { id: parseInt(id) },
      });

      if (!post) {
        throw new BadRequestException(`Không tìm thấy bài post với ID: ${id}`);
      }

      // Kiểm tra trạng thái hiện tại
      if (post.status !== 'pending') {
        throw new BadRequestException(
          `Bài post này đã được xử lý với trạng thái: ${post.status}`,
        );
      }

      // Cập nhật trạng thái thành rejected
      await this.postRepository.update(
        { id: parseInt(id) },
        {
          status: 'rejected',
        },
      );

      return {
        id: id,
        message: `Bài post với ID ${id} đã bị từ chối.`,
      };
    } catch (error) {
      throw error;
    }
  }

  async handleBanUser(email: string) {
    return await this.userService.handleBanUser(email);
  }
}
