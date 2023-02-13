import { Controller, Post, Body, ValidationPipe, Res, Request, Get } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void>{
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        return this.authService.signIn(authCredentialsDto);
    }

    // @Post('/test')
    // @UseGuards(AuthGuard())
    // test(@GetUser('user') user: User){
    //     console.log(user);        
    // }
}
