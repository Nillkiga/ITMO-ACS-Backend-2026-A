import { Get, Post, Param, Body, JsonController, QueryParam, UseBefore } from 'routing-controllers';
import { dataSource } from '../config/data-source';
import { Table } from '../models/table.entity';
import { Restaurant } from '../models/restaurant.entity';
import { internalAuthMiddleware } from '../middlewares/internal-auth.middleware';

@JsonController('/internal/v1')
@UseBefore(internalAuthMiddleware)
export class InternalController {
    private tableRepo = dataSource.getRepository(Table);
    private restaurantRepo = dataSource.getRepository(Restaurant);

    @Get('/tables/:tableId/validate')
    async validateTable(
        @Param('tableId') tableId: number,
        @QueryParam('date') date: string,
        @QueryParam('startTime') startTime: string,
        @QueryParam('endTime') endTime: string
    ) {
        const table = await this.tableRepo.findOne({
            where: { id: tableId },
            relations: ['restaurant']
        });

        if (!table) {
            return {
                exists: false,
                capacity: 0,
                isAvailable: false
            };
        }

        // TODO: проверить, свободен ли столик на указанное время
        // Пока возвращаем true для тестирования
        const isAvailable = true;

        return {
            exists: true,
            capacity: table.capacity,
            isAvailable: isAvailable,
            restaurantId: table.restaurantId
        };
    }

    @Post('/restaurants/:restaurantId/update-rating')
    async updateRating(
        @Param('restaurantId') restaurantId: number,
        @Body() body: { newRating: number; reviewsCount: number }
    ) {
        const restaurant = await this.restaurantRepo.findOneBy({ id: restaurantId });
        
        if (!restaurant) {
            return {
                success: false,
                error: 'Restaurant not found',
                code: 'RESTAURANT_NOT_FOUND'
            };
        }

        // TODO: добавить поле rating в таблицу restaurant
        // Пока просто логируем
        console.log(`Updating rating for restaurant ${restaurantId}: ${body.newRating} (${body.reviewsCount} reviews)`);

        return { success: true };
    }
}