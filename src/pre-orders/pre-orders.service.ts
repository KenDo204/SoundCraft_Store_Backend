import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePreOrderDto } from './dto/create-pre-order.dto';
import { UpdatePreOrderDto } from './dto/update-pre-order.dto';
import { PreOrder } from './entities/pre-order.entity';
import { Product } from '@/products/entities/product.entity';
import { User } from '@/users/entities/user.entity';
import { NotificationsService } from '@/notifications/notifications.service';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationType } from '@/notifications/enums/notification-type.enum';

@Injectable()
export class PreOrdersService {
  constructor(
    @InjectRepository(PreOrder)
    private readonly preOrderRepo: Repository<PreOrder>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly notificationsService: NotificationsService,
    private readonly mailerService: MailerService,
  ) {}

  async create(userId: number, createPreOrderDto: CreatePreOrderDto) {
    const { product_id, customer_note } = createPreOrderDto;

    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    const product = await this.productRepo.findOne({ where: { product_id } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    // Kiểm tra xem đã đăng ký nhận thông báo cho sản phẩm này chưa (chưa được thông báo)
    const existing = await this.preOrderRepo.findOne({
      where: {
        user: { user_id: userId },
        product: { product_id },
        status: 'PENDING'
      }
    });

    if (existing) {
      throw new BadRequestException('Bạn đã đăng ký nhận thông báo cho sản phẩm này rồi');
    }

    const preOrder = this.preOrderRepo.create({
      user,
      product,
      customer_note,
      status: 'PENDING',
    });

    await this.preOrderRepo.save(preOrder);

    // Tạo thông báo
    const notificationTitle = 'Đăng ký nhận thông báo thành công';
    let notificationMessage = `Bạn đã đăng ký nhận thông báo khi có hàng cho sản phẩm có ID: ${product.product_id}. Chúng tôi sẽ liên hệ ngay khi sản phẩm có sẵn.`;
    if (product.product_name) {
      notificationMessage = `Bạn đã đăng ký nhận thông báo khi có hàng cho sản phẩm: ${product.product_name}. Chúng tôi sẽ liên hệ ngay khi sản phẩm có sẵn.`;
    }
    
    await this.notificationsService.createNotification(
      userId,
      notificationTitle,
      notificationMessage,
      NotificationType.PRE_ORDER,
    );

    // Gửi email
    try {
      const productName = product.product_name || `Sản phẩm ID: ${product.product_id}`;
      await this.mailerService.sendMail({
        to: user.email,
        subject: '[Nhạc Cụ System] Đăng ký nhận thông báo khi có hàng',
        html: `
          <h2>Xin chào ${user.full_name},</h2>
          <p>Bạn vừa đăng ký nhận thông báo khi sản phẩm <strong>${productName}</strong> có hàng trở lại.</p>
          <p>Chúng tôi đã ghi nhận yêu cầu của bạn và sẽ gửi email thông báo ngay khi sản phẩm vừa được nhập kho.</p>
          <br/>
          <p>Trân trọng,</p>
          <p>Đội ngũ Nhạc Cụ System</p>
        `,
      });
    } catch (error) {
      console.error('Lỗi gửi mail pre-order:', error);
    }

    return { message: 'Đăng ký nhận thông báo thành công', preOrder };
  }

  async findAll() {
    return this.preOrderRepo.find({
      relations: ['user', 'product'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number) {
    const preOrder = await this.preOrderRepo.findOne({
      where: { pre_order_id: id },
      relations: ['user', 'product'],
    });

    if (!preOrder) {
      throw new NotFoundException(`Không tìm thấy đăng ký nhận thông báo ID: ${id}`);
    }

    return preOrder;
  }

  async update(id: number, updatePreOrderDto: UpdatePreOrderDto) {
    const preOrder = await this.findOne(id);
    
    if (updatePreOrderDto.status) {
      preOrder.status = updatePreOrderDto.status;
      if (updatePreOrderDto.status === 'NOTIFIED') {
        preOrder.notified_at = new Date();
      }
    }

    if (updatePreOrderDto.customer_note !== undefined) {
      preOrder.customer_note = updatePreOrderDto.customer_note;
    }

    return this.preOrderRepo.save(preOrder);
  }

  async remove(id: number) {
    const preOrder = await this.findOne(id);
    await this.preOrderRepo.remove(preOrder);
    return { message: 'Xóa thành công' };
  }
}
