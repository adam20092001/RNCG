import { Controller, Get, Param, Patch, Post, Body, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post()
  create(@Body() body: { userId: number; title: string; message: string }) {
    return this.service.create(body.userId, body.title, body.message);
  }

  @Get()
  findByUser(@Query('userId') userId: number) {
    return this.service.findByUser(Number(userId));
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: number) {
    return this.service.markAsRead(Number(id));
  }
}
