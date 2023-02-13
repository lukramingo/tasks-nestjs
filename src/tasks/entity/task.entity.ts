import { User } from '../../auth/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from '../task-status.enum'; 

@Entity()
export class Task { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne(type => User, user => user.tasks)
    user: User;

    @Column()
    userId: number;
}