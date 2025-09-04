// src/patients/entities/patient.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Prediction } from 'src/predictions/entities/prediction.entity';
import { bool } from 'aws-sdk/clients/signer';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  age: number;

  @Column()
  sex: string;

  @Column()
  dni: string;

  @Column()
  disable: boolean;
//EVALUAR LAS RELACIONES 
  @ManyToOne(() => User, (user) => user.patients)
  user: User;

  @OneToMany(() => Prediction, (prediction) => prediction.patient)
  predictions: Prediction[];
}


