import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) { }
  async create(userId: number, title: string, message: string, predictionId: number) {
    const notif = this.notificationRepo.create({
      user: { id: userId } as any,
      title,
      message,
      predictions: { id: predictionId } as any,
    });
    return this.notificationRepo.save(notif);
  }
  async findByUser(userId: number) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
  async findByUserPrediction(userId: number, predictionId: number) {
    return this.notificationRepo.findOne({
      where: { user: { id: userId }, predictions: { id: predictionId } },
      relations: ['user', 'prediction'],
    });
  }
  async markAsRead(userId: number, predictionId: number) {
    const notif = await this.notificationRepo.findOne({
      where: {
        user: { id: userId },
        predictions: { id: predictionId },
      },
    });

    if (!notif) {
      throw new Error('Notificación no encontrada');
    }

    notif.isRead = true;
    return this.notificationRepo.save(notif);
  }
}