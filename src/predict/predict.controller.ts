import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PredictService } from './predict.service';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('predict')
export class PredictController {
  constructor(private readonly predictService: PredictService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async predict(
    @UploadedFile() file: Express.Multer.File,
    @Body('patientId') patientId: number,
    @Body('userId') userId: number, // Por ahora, lo pasas manualmente
  ) {
    if (!file) {
      throw new Error('No se recibió imagen');
    }
    console.log('📩 Request recibido en controlador')
    const result = await this.predictService.predictAndSave(
      file.filename,
      userId,
      patientId,
    );

    return {
      message: '✅ Predicción guardada con éxito',
      data: result,
    };
  }
}
