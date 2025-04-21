import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PredictModule } from './predict/predict.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';
import { UsersModule } from './users/users.module';
import { PredictionsModule } from './predictions/predictions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'adamssjj2',
      database: 'rncg',
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo, cuidado en producción
    }),
    PredictModule,
    PatientsModule,
    UsersModule,
    PredictionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
