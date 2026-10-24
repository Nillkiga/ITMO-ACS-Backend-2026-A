import { Get, Post, Param, Body, JsonController } from 'routing-controllers';
import { dataSource } from '../config/data-source';
import { Review } from '../models/review.entity';
import { publishEvent } from '../rabbitmq';

interface CreateReviewDto {
    userId: number;
    restaurantId: number;
    rating: number;
    comment: string;
}

@JsonController('/api/reviews')
export class ReviewController {
    private reviewRepo = dataSource.getRepository(Review);

    @Get('/')
    async getAll() {
        return await this.reviewRepo.find();
    }

    @Get('/restaurant/:restaurantId')
    async getByRestaurant(@Param('restaurantId') restaurantId: number) {
        const reviews = await this.reviewRepo.find({
            where: { restaurantId },
            order: { createdAt: 'DESC' }
        });

        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        return {
            restaurantId,
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalReviews: reviews.length,
            reviews
        };
    }

    @Get('/user/:userId')
    async getByUser(@Param('userId') userId: number) {
        const reviews = await this.reviewRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });

        return {
            userId,
            reviews
        };
    }

    @Post('/')
    async create(@Body() reviewData: CreateReviewDto) {
        if (reviewData.rating < 1 || reviewData.rating > 5) {
            return {
                message: 'Rating must be between 1 and 5',
                error: 'INVALID_RATING'
            };
        }

        const existingReview = await this.reviewRepo.findOne({
            where: {
                userId: reviewData.userId,
                restaurantId: reviewData.restaurantId
            }
        });

        if (existingReview) {
            return {
                message: 'User already reviewed this restaurant',
                error: 'REVIEW_ALREADY_EXISTS'
            };
        }

        const review = this.reviewRepo.create(reviewData);
        const savedReview = await this.reviewRepo.save(review);

        // Получаем все отзывы для ресторана для расчета нового рейтинга
        const allReviews = await this.reviewRepo.find({
            where: { restaurantId: reviewData.restaurantId }
        });

        const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        const reviewsCount = allReviews.length;

        // Отправляем событие через RabbitMQ
        await publishEvent('review.created', {
            restaurantId: reviewData.restaurantId,
            newRating: parseFloat(averageRating.toFixed(1)),
            reviewsCount
        });

        return {
            success: true,
            review: savedReview
        };
    }
}