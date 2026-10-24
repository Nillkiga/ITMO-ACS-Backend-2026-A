import { Get, Param, JsonController } from 'routing-controllers';
import { dataSource } from '../config/data-source';
import { Review } from '../models/review.entity';

@JsonController('/internal/v1')
export class InternalController {
    private reviewRepo = dataSource.getRepository(Review);

    @Get('/restaurants/:restaurantId/stats')
    async getRestaurantStats(@Param('restaurantId') restaurantId: number) {
        const reviews = await this.reviewRepo.find({
            where: { restaurantId }
        });

        if (reviews.length === 0) {
            return {
                restaurantId,
                averageRating: 0,
                totalReviews: 0
            };
        }

        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        return {
            restaurantId,
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalReviews: reviews.length
        };
    }

    @Get('/users/:userId/reviews')
    async getUserReviews(@Param('userId') userId: number) {
        const reviews = await this.reviewRepo.find({
            where: { userId }
        });

        return {
            userId,
            reviews
        };
    }
}