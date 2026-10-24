import {
    Param,
    Body,
    Get,
    Post,
    Patch,
    UseBefore,
    Req,
    JsonController,
} from 'routing-controllers';
import { dataSource } from '../config/data-source';
import { User } from '../models/user.entity';
import authMiddleware, { RequestWithUser } from '../middlewares/auth.middleware';

@JsonController('/api/users')
export class UserController {
    private userRepo = dataSource.getRepository(User);

    @Get('/')
    async getAll() {
        return await this.userRepo.find();
    }

    @Post('/')
    async create(@Body() userData: Partial<User>) {
        const createdUser = this.userRepo.create(userData);
        return await this.userRepo.save(createdUser);
    }

    @Get('/me')
    @UseBefore(authMiddleware)
    async me(@Req() request: RequestWithUser) {
        const { user } = request;
        return await this.userRepo.findOneBy({ id: user.id });
    }

    @Get('/:id')
    @UseBefore(authMiddleware)
    async getById(@Param('id') id: number) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    @Patch('/:id')
    @UseBefore(authMiddleware)
    async update(@Param('id') id: number, @Body() userData: Partial<User>) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new Error('User not found');
        }
        Object.assign(user, userData);
        return await this.userRepo.save(user);
    }
}