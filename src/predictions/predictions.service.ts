import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(Prediction)
    private readonly predictionRepo: Repository<Prediction>,
    
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {} 
    async create(data: {
      result: string;
      score: number;
      image: string;
      probabilities: {
        EGC: number;
        'LESIONES BENIGNAS': number;
        NORMAL: number;
      };
      userId: number;
      patientId: number;
    }) {
      const user = await this.userRepo.findOneBy({ id: data.userId });
      const patient = await this.patientRepo.findOneBy({ id: data.patientId });
    
      if (!user || !patient) {
        throw new Error('Usuario o paciente no válido');
      }
    
      const prediction = this.predictionRepo.create({
        result: data.result,
        score: data.score,
        image: data.image,
        probabilities: data.probabilities,
        user,
        patient,
        validate: false,
        comment: null,
      });
    
      try {
        return await this.predictionRepo.save(prediction);
      } catch (error) {
        console.error('Error al guardar predicción:', error);
        throw new Error('Error al guardar predicción en la base de datos');
      }
      
    }
    async findByUser(userId: number): Promise<Prediction[]> {
      return this.predictionRepo.find({
        where: { user: { id: userId } },
        relations: ['user', 'patient'],
        order: { date: 'DESC' },
      });
    }
    async findByPatient(patientId: number): Promise<Prediction[]> {
      return this.predictionRepo.find({
        where: { patient: { id: patientId } },
        relations: ['user', 'patient'],
        order: { date: 'DESC' },
      });
    }
    async findByUserAndPatient(userId: number, patientId: number): Promise<Prediction[]> {
      return this.predictionRepo.find({
        where: {
          user: { id: userId },
          patient: { id: patientId },
        },
        relations: ['user', 'patient'],
        order: { date: 'DESC' },
      });
    }
    async delete(id: number): Promise<void> {
      const prediction = await this.predictionRepo.findOne({ where: { id } });
      if (!prediction) {
        throw new NotFoundException(`Predicción con ID ${id} no encontrada`);
      }
      await this.predictionRepo.delete(id);
    }
    async validatePrediction(id: number, comment?: string): Promise<Prediction> {
      const prediction = await this.predictionRepo.findOne({ where: { id } });
      if (!prediction) {
        throw new NotFoundException(`Predicción con ID ${id} no encontrada`);
      }
      prediction.validate = true;
      if (comment) {
        prediction.comment = comment;
      }
      return this.predictionRepo.save(prediction);
    }
}