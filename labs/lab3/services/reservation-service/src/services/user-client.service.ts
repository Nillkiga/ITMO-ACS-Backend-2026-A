import axios, { AxiosInstance } from 'axios';
import settings from '../config/settings';

interface UserExistsResponse {
    exists: boolean;
    user?: {
        id: number;
        email: string;
        fullName: string;
    };
}

export class UserClientService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: settings.AUTH_USER_SERVICE_URL,
            timeout: 3000,
            headers: {
                'X-Internal-Token': settings.INTERNAL_TOKEN
            }
        });
    }

    async checkUserExists(userId: number): Promise<boolean> {
        try {
            const response = await this.client.get<UserExistsResponse>(
                `/internal/v1/users/${userId}/exists`
            );
            return response.data.exists;
        } catch (error) {
            console.error('User service error:', error);
            return false;
        }
    }
}