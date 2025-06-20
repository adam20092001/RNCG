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
import { extname } from 'path';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as dotenv from 'dotenv';
dotenv.config();

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucket = process.env.AWS_S3_BUCKET;

if (!region || !accessKeyId || !secretAccessKey || !bucket) {
  throw new Error('❌ Faltan variables de entorno AWS.');
}

const s3 = new AWS.S3({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});


const storage = multerS3({
  s3,
  bucket,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9) + extname(file.originalname);
    cb(null, uniqueName);
  },
});

interface S3MulterFile extends Express.Multer.File {
  key: string;
  location: string;
}

@Controller('predict')
export class PredictController {
  constructor(private readonly predictService: PredictService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {  storage }))
  async predict(
    
    @UploadedFile() file: S3MulterFile,
    @Body('patientId') patientId: number,
    @Body('userId') userId: number, // Por ahora, lo pasas manualmente
  ) {
    if (!file) {
      throw new Error('No se recibió imagen');
    }
try {
  console.log('📥 Archivo recibido:', file);
  const result = await this.predictService.predictAndSave(
    file.key,
    userId,
    patientId,
  );
  return {
    message: 'Predicción guardada con éxito',
    imageUrl: file.location,
    data: result,
  };
} catch (error) {
  console.error('❌ Error en controlador:', error);
  throw error;
}


/*     console.log('📦 Archivo recibido:', file);
    const result = await this.predictService.predictAndSave(
      file.key,
      userId,
      patientId,
    );

    return {
      message: 'Predicción guardada con éxito',
      imageUrl: file.location,
      data: result,
    };
  } */
}}
