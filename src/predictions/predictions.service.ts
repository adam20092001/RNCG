import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';


@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(Prediction)
    private readonly predictionRepo: Repository<Prediction>,
    
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    private readonly notificationsService: NotificationsService,
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
        const savedPrediction = await this.predictionRepo.save(prediction);
        if (data.probabilities.EGC > 0.8) {
          await this.notificationsService.create(
            user.id,
            'Alerta de diagnóstico',
            `El análisis del paciente ${patient.id} muestra un ${(
              data.probabilities.EGC * 100
              ).toFixed(2)}% de probabilidad de EGC. Revisar inmediatamente.`
          );
        }
        return savedPrediction;
        //return await this.predictionRepo.save(prediction);  //logica anterior
      } catch (error) {
        console.error('Error al guardar predicción:', error);
        throw new Error('Error al guardar predicción en la base de datos');
      }
      
    }
    async findById(id: number) {
      return await this.predictionRepo.findOne({
        where: { id },
        relations: ['user', 'patient'], // solo si necesitas incluir relaciones
      });
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
      if (prediction.validate) {
        prediction.validate = false;
        prediction.comment = null;
      } else {
        prediction.validate = true;
        if (comment) {
          prediction.comment = comment;
        }
      }
      return this.predictionRepo.save(prediction);
    }
}