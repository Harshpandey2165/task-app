import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' })
  status: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}