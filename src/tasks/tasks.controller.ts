import { Body, Controller, Delete, Get, Param, Patch, 
    Post, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger 
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create.task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from 'src/pipes/task-status-validation.pipe';
import { Task } from './entity/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(private tasksService: TasksService){} 

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser('user') user: User
        ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`)
       return this.tasksService.createTask(createTaskDto, user);
    }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser('user') user: User
        ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('user') user: User
        ): Promise<Task>{
        return this.tasksService.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('user') user: User
        ){ 
       return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTask(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser('user') user: User
         ): Promise<Task>
    {
        return this.tasksService.updateTask(id, status, user); 
    } 
}
