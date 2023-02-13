import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Task } from '../tasks/entity/task.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
    @OneToMany(type => Task, task => task.user)
    tasks: Task[]
}