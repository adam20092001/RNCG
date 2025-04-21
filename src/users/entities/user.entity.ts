import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Prediction } from 'src/predictions/entities/prediction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  mail: string;

  @Column()
  password: string;
//EVALUAR LAS RELACIONES
  @OneToMany(() => Patient, (patient) => patient.user)
  patients: Patient[];

  @OneToMany(() => Prediction, (prediction) => prediction.user)
  predictions: Prediction[];
}
