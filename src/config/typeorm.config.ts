import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../auth/user.entity";
import { Task } from "../tasks/entity/task.entity";
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [Task, User],  
    synchronize: true,
  }