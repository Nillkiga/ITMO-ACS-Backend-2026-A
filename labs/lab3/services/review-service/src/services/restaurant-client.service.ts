import axios, { AxiosInstance } from 'axios';
import settings from '../config/settings';

interface UpdateRatingResponse {
    success: boolean;
    error?: string;
    code?: string;
}

export class RestaurantClientService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: settings.RESTAURANT_SERVICE_URL,
            timeout: 5000,
            headers: {
                'X-Internal-Token': settings.INTERNAL_TOKEN
            }
        });
    }

    async updateRestaurantRating(restaurantId: number, newRating: number, reviewsCount: number): Promise<boolean> {
        try {
            const response = await this.client.post<UpdateRatingResponse>(
                `/internal/v1/restaurants/${restaurantId}/update-rating`,
                {
                    newRating,
                    reviewsCount
                }
            );
            return response.data.success;
        } catch (error) {
            console.error('Failed to update restaurant rating:', error);
            return false;
        }
    }
}