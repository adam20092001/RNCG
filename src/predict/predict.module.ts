import { Module } from '@nestjs/common';
import { PredictController } from './predict.controller';
import { PredictService } from './predict.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictionsModule } from 'src/predictions/predictions.module';
import { UsersModule } from 'src/users/users.module';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    PredictionsModule,     // ✅ Importa aquí
    UsersModule,
    PatientsModule,
  ],
  controllers: [PredictController],
  providers: [PredictService]
})
export class PredictModule {}
