import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PredictionsService {
    constructor(
        @InjectRepository(Prediction)
        private readonly patientRepo: Repository<Prediction>, // ✅ esta línea es la correcta
      ) {}
}
