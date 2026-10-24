import { Get, Param, JsonController } from 'routing-controllers';
import { dataSource } from '../config/data-source';
import { User } from '../models/user.entity';

@JsonController('/internal/v1')
export class InternalController {
    private userRepo = dataSource.getRepository(User);

    @Get('/users/:userId/exists')
    async checkUserExists(@Param('userId') userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            select: ['id', 'email', 'fullName']
        });

        if (!user) {
            return { exists: false };
        }

        return {
            exists: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName
            }
        };
    }
}