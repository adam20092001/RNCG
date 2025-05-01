import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { Patient } from 'src/patients/entities/patient.entity';
  import { User } from 'src/users/entities/user.entity';
  
  @Entity()
  export class Prediction {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    result: string;
  
    @Column({ type: 'float', nullable: true })
    score: number;
  
    @Column()
    image: string;

    @CreateDateColumn()
    date: Date;
  
    @Column({ type: 'jsonb', name: 'probabilities', nullable: true })
    probabilities: {
      EGC: number;
      'LESIONES BENIGNAS': number;
      NORMAL: number;
    };

    @Column({ default: false, name: 'validado' })
    validate: boolean;

    @Column({ type: 'text', nullable: true, name: 'comment' })
    comment: string | null;
  
    @ManyToOne(() => Patient, (patient) => patient.predictions)
    patient: Patient;
  
    @ManyToOne(() => User, (user) => user.predictions)
    user: User;
  }
  