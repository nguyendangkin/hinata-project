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

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

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

      //  Kiểm tra số lượng ảnh
      if (imageFiles.length > 10) {
        throw new BadRequestException(`Item ${i + 1}: Tối đa chỉ được 10 ảnh`);
      }

      // khai báo mảng để lưu đường dẫn ảnh
      const imagePaths: string[] = [];
      for (const file of imageFiles) {
        //  Kiểm tra loại file ảnh
        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new BadRequestException(
            `Item ${i + 1}: File ${file.originalname} không phải là ảnh hợp lệ`,
          );
        }

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

  async getAllPostForClient(
    current: number = 1,
    pageSize: number = 10,
    search?: string,
  ) {
    try {
      const skip = (current - 1) * pageSize;

      const query = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .where('post.status = :status', { status: 'approved' });

      // Nếu có từ khóa tìm kiếm, áp dụng tìm theo các field
      if (search) {
        const searchLower = `%${search.toLowerCase()}%`;
        query.andWhere(
          `(LOWER(CAST(post.id AS TEXT)) LIKE :search
          OR LOWER(post.bankAccountName) LIKE :search
          OR LOWER(post.bankAccountNumber) LIKE :search
          OR LOWER(post.phoneNumber) LIKE :search
          OR LOWER(post.facebookProfileLink) LIKE :search)`,
          { search: searchLower },
        );
      }
      // Sắp xếp tăng dần theo thời gian tạo  // Áp dụng phân trang
      query.orderBy('post.createdAt', 'DESC').skip(skip).take(pageSize);

      // Thực hiện truy vấn và lấy kết quả + tổng số bản ghi
      const [posts, total] = await query.getManyAndCount();

      // Chuyển đổi kết quả sang định dạng client mong muốn
      const results = posts.map((post) => ({
        key: post.id.toString(),
        id: post.id,
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
      throw error;
    }
  }

  async handleGetAPost(id: string) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['user'], // Lấy cả thông tin user liên quan
      });

      if (!post) {
        throw new BadRequestException(`Không tìm thấy bài post với ID: ${id}`);
      }

      return {
        id: post.id,
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
        createdAt: post.createdAt,
      };
    } catch (error) {
      throw error;
    }
  }

  async handleGetAllPostForProfile(
    user: User,
    current: number = 1,
    pageSize: number = 10,
  ) {
    try {
      const skip = (current - 1) * pageSize;

      const [posts, total] = await this.postRepository
        .createQueryBuilder('post')
        .where('post.userId = :userId', { userId: user.id })
        .orderBy('post.createdAt', 'DESC')
        .skip(skip)
        .take(pageSize)
        .getManyAndCount();

      const results = posts.map((post) => ({
        id: post.id,
        bankAccountName: post.bankAccountName,
        phoneNumber: post.phoneNumber,
        bankAccount: post.bankAccountNumber,
        bankName: post.bankName,
        facebookLink: post.facebookProfileLink,
        reportLink: post.complaintLink,
        proofImages: post.imagePaths || [],
        comment: post.personalComment,
        status: post.status,
        createdAt: post.createdAt,
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
      throw error;
    }
  }
}
