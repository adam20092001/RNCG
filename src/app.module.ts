import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PredictModule } from './predict/predict.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';
import { UsersModule } from './users/users.module';
import { PredictionsModule } from './predictions/predictions.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    /* TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'adamssjj2',
      database: 'rncg',
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo, cuidado en producción
    }), */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
      type: 'postgres',
      host: config.get<string>('DB_HOST'),
      port: config.get<number>('DB_PORT'),
      username: config.get<string>('DB_USER'),
      password: config.get<string>('DB_PASS'),
      database: config.get<string>('DB_NAME'),
      ssl: {
        rejectUnauthorized: false, // No verifiques el certificado (válido en dev)
      },
      autoLoadEntities: true,
      synchronize: config.get<boolean>('TYPEORM_SYNCHRONIZE'),
      logging: config.get<boolean>('TYPEORM_LOGGING', false),
    }),
    }),
    PredictModule,
    PatientsModule,
    UsersModule,
    PredictionsModule,
    AuthModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
