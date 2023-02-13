import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create.task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { Task } from './entity/task.entity';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class TasksService {
    private logger = new Logger('TasksService');

    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        ){}
    
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
        const {title, description} = createTaskDto;

        const task = new Task()
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user
        await this.tasksRepository.save(task);   

        delete task.user;

        return task;
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>{
        const {status, search} = filterDto;
        const query = this.tasksRepository
        .createQueryBuilder('task')
        
        query.andWhere('task.userId = :userId', {userId: user.id})
        
        if(status){
            query.andWhere('task.status = :status', {status})
        }
        if(search){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`})
        }
        try{            
            const tasks = await query.getMany();
            return tasks;
        }catch(error){
            this.logger.error(`Failed to get tasks for user "${user.username}", DTO: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async getTaskById(id: number, user: User): Promise<Task>{
        const task = await this.tasksRepository.findOne({where : { id, userId: user.id}});
        if(!task){
            throw new NotFoundException(`this ${id} not found!`);
        }
        return task;
    }

    async deleteTask(id: number, user: User){
       const task = await this.getTaskById(id, user);
       if(!task){
        throw new NotFoundException('task not found');
       }
       return this.tasksRepository.remove(task);
    }

    async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        if(!task){
            throw new NotFoundException('task not found');
        }
        task.status = status;
        await this.tasksRepository.save(task);
        return task;
    }

}
