import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { User } from 'src/users/entities/user.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prediction, User, Patient]),NotificationsModule],
  providers: [PredictionsService],
  controllers: [PredictionsController],
  exports: [PredictionsService]
})
export class PredictionsModule {}
