import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import {Repository} from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService')

    constructor(@InjectRepository(User) 
    private userRepository: Repository<User>,
    private jwtService: JwtService
    ){}
    
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        const {username, password} = authCredentialsDto;

        const existUser = await this.userRepository.findOneBy({username});

        if(existUser){
            throw new ConflictException('user already exist');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User(); 
        user.username = username;
        user.password = hashedPassword;
        await this.userRepository.save(user);
    } 

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        const {username, password} = authCredentialsDto;
        const [user] = await this.userRepository.findBy({username});

        if(!user){
            throw new UnauthorizedException('Invalid username');
        }

        if(!await bcrypt.compare(password, user.password)){
            throw new UnauthorizedException('Invalid Password');
        }
        
        const payload: JwtPayload = {username};
        const accessToken = await this.jwtService.sign(payload);

        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

        return { accessToken };
    }

    findByUsername(username: string){
        return this.userRepository.findOneBy({username});
    }
  
}
