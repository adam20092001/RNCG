import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async create(userId: number, title: string, message: string) {
    const notif = this.notificationRepo.create({
      user: { id: userId } as any, // si usas relación con User
      title,
      message,
    });
    return this.notificationRepo.save(notif);
  }

  async findByUser(userId: number) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number) {
    await this.notificationRepo.update(id, { isRead: true });
    return { success: true };
  }
}
