import { Controller, Get, Param, Patch, Post, Body, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) { }

  @Post()
  create(@Body() body: { userId: number; title: string; message: string; predictionId: number }) {
    return this.service.create(body.userId, body.title, body.message, body.predictionId);
  }

  @Get()
  findByUser(@Query('userId') userId: number) {
    return this.service.findByUser(Number(userId));
  }

  @Get('user/:userId/patient/:patientId')
  findByUserPatient(
    @Param('userId') userId: number,
    @Param('patientId') patientId: number,) {
    return this.service.findByUserPrediction(+userId, +patientId);
  }
  @Patch(':userId/:predictionId/read')
  async markAsRead(
    @Param('userId') userId: number,
    @Param('predictionId') predictionId: number,
  ) {
    return this.service.markAsRead(userId, predictionId);
  }
}
