import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Prediction } from '../../predictions/entities/prediction.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.notifications, { eager: false })
  user: User; // toda la clase User como relación

  @ManyToOne(() => Prediction, (prediction) => prediction.patient, { eager: false })
  predictions: Prediction; // toda la clase User como relación

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
