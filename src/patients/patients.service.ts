import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>, // ✅ esta línea es la correcta
  ) {}
  async findAll(): Promise<Patient[]> {
    return this.patientRepo.find({ relations: ['user'] }); // para ver también el médico asociado
  }
  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  
    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
  
    return patient;
  }
  async create(data: Partial<Patient>): Promise<Patient> {
    const exists = await this.patientRepo.findOne({ where: { dni: data.dni } });
    if (exists) {
      throw new ConflictException('El DNI ya está registrado');
    }
    const newPatient = this.patientRepo.create(data);
    return this.patientRepo.save(newPatient);
  }
  async update(id: number, data: Partial<Patient>): Promise<Patient> {
    await this.patientRepo.update(id, data);
    return this.findOne(id);
  }
  async delete(id: number): Promise<void> {
    await this.patientRepo.delete(id);
  }
}
