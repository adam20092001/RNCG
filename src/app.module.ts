import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PredictModule } from './predict/predict.module';

@Module({
  imports: [PredictModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
