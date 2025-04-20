import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { PredictService } from './predict.service';
  import { Express } from 'express';
  
  @Controller('predict')
  export class PredictController {
    constructor(private readonly predictService: PredictService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async predict(@UploadedFile() file: Express.Multer.File) {
      const result = await this.predictService.predictImageBuffer(file.buffer);
      return { result };
    }
  }
  