import axios, { AxiosInstance } from 'axios';
import settings from '../config/settings';

interface TableValidationResponse {
    exists: boolean;
    capacity: number;
    isAvailable: boolean;
    restaurantId?: number;
}

export class RestaurantClientService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: settings.RESTAURANT_SERVICE_URL,
            timeout: 3000,
            headers: {
                'X-Internal-Token': settings.INTERNAL_TOKEN
            }
        });
    }

    async validateTable(
        tableId: number,
        date: string,
        startTime: string,
        endTime: string
    ): Promise<TableValidationResponse> {
        try {
            const response = await this.client.get<TableValidationResponse>(
                `/internal/v1/tables/${tableId}/validate`,
                {
                    params: { date, startTime, endTime }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Restaurant service error:', error);
            return {
                exists: false,
                capacity: 0,
                isAvailable: false
            };
        }
    }
}