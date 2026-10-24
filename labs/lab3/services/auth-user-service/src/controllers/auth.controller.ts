import { Body, Post, JsonController } from 'routing-controllers';
import { IsString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import jwt from 'jsonwebtoken';
import { dataSource } from '../config/data-source';
import { User } from '../models/user.entity';
import checkPassword from '../utils/check-password';
import settings from '../config/settings';

class LoginDto {
    @IsEmail()
    @Type(() => String)
    email!: string;

    @IsString()
    @Type(() => String)
    password!: string;
}

class LoginResponseDto {
    @IsString()
    accessToken!: string;
}

class ErrorResponseDto {
    @IsString()
    message!: string;
}

@JsonController('/api/auth')
export class AuthController {
    private userRepo = dataSource.getRepository(User);

    @Post('/login')
    async login(
        @Body({ type: LoginDto }) loginData: LoginDto,
    ): Promise<LoginResponseDto | ErrorResponseDto> {
        const { email, password } = loginData;
        const user = await this.userRepo.findOneBy({ email });

        if (!user) {
            return { message: 'User is not found' };
        }

        const isPasswordCorrect = checkPassword(user.password, password);

        if (!isPasswordCorrect) {
            return { message: 'Password or email is incorrect' };
        }

        const accessToken = jwt.sign(
            { user: { id: user.id } },
            settings.JWT_SECRET_KEY,
            { expiresIn: settings.JWT_ACCESS_TOKEN_LIFETIME },
        );

        return { accessToken };
    }
}